
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Spinner } from './Spinner.js';

const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export const GoogleDrivePicker = ({ clientId, apiKey, onClose, onFileSelect }) => {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const pickerApiLoaded = useRef(false);
  const oauthToken = useRef(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleResetClientId = () => {
    localStorage.removeItem('google_client_id');
    localStorage.removeItem('google_api_key');
    window.location.reload();
  };

  const copyOrigin = () => {
    navigator.clipboard.writeText(window.location.origin);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const pickerCallback = useCallback(async (data) => {
    if (data.action === google.picker.Action.PICKED) {
      const doc = data.docs[0];
      setStatus(`Downloading ${doc.name}...`);
      
      try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`, {
          headers: {
            'Authorization': `Bearer ${oauthToken.current.access_token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to download file: ${errorData.error?.message || response.statusText}`);
        }

        const blob = await response.blob();
        await onFileSelect(doc.name, doc.mimeType, blob);
        onClose();

      } catch (err) {
        console.error(err);
        setError(err.message || 'Could not download file. Ensure Drive API is enabled in your Google Cloud project.');
      }
    } else if (data.action === google.picker.Action.CANCEL) {
      onClose();
    }
  }, [onFileSelect, onClose]);

  const createPicker = useCallback(() => {
    if (!pickerApiLoaded.current || !oauthToken.current) return;
    
    setStatus('Opening file picker...');
    try {
        const view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("application/epub+zip,application/pdf,text/plain");

        const picker = new google.picker.PickerBuilder()
          .addView(view)
          .setOAuthToken(oauthToken.current.access_token)
          .setDeveloperKey(apiKey)
          .setCallback(pickerCallback)
          .build();
        
        // Add a small delay before showing the picker to mitigate timing issues.
        setTimeout(() => {
            picker.setVisible(true);
        }, 100); 

    } catch (err) {
        // The Google Picker library can throw an error like "API developer key is invalid"
        // This is caught here and will be reflected in the error state.
        setError(err.message || 'Failed to create picker. Check if the API Key has the Drive API enabled and no strict restrictions.');
    }
  }, [pickerCallback, apiKey]);
  
  useEffect(() => {
    console.log("Using Google Client ID for authentication:", clientId);

    const initializeAndAuth = () => {
        setStatus('Loading Google API...');
        if (typeof gapi === 'undefined' || typeof google === 'undefined' || !gapi.load || !google.accounts) {
          setError('Google API scripts not fully loaded. Check network and script tags.');
          return;
        }

        gapi.load('picker', () => {
            pickerApiLoaded.current = true;
            setStatus('Authenticating...');
            try {
                const tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: SCOPES,
                    callback: (tokenResponse) => {
                        if (tokenResponse.error) {
                            console.error('Auth Error:', tokenResponse);
                            let detailedError = `Authentication failed: ${tokenResponse.error_description || tokenResponse.error}`;
                            
                            // Specific handling for redirect_uri_mismatch and origin mismatch
                            if (tokenResponse.error === 'invalid_request' && tokenResponse.error_description?.includes('redirect_uri_mismatch')) {
                                detailedError = "Error 400: Redirect URI Mismatch. Check Google Cloud Console settings.";
                            } else if (tokenResponse.error === 'invalid_request') {
                                detailedError = "Error 400: Origin mismatch or wrong Project ID. Check Google Cloud Console settings.";
                            }
                            
                            setError(detailedError);
                            return;
                        }
                        oauthToken.current = tokenResponse;
                        createPicker();
                    },
                });
                tokenClient.requestAccessToken({ prompt: '' });
            } catch (err) {
                setError(`GSI Client Error: ${err.message || 'Unknown GSI error'}`);
            }
        });
    };

    const checkGapiReady = () => {
        if (typeof gapi !== 'undefined' && typeof google !== 'undefined' && gapi.load && google.accounts) {
            clearInterval(intervalId);
            initializeAndAuth();
        }
    };

    const intervalId = setInterval(checkGapiReady, 100);
    return () => clearInterval(intervalId);
  }, [createPicker, clientId]);

  const isOriginOrRedirectError = error?.includes('Error 400');
  const isApiKeyInvalidError = error?.includes('The API developer key is invalid') || (error && (error.includes('Failed to open file picker') || error.includes('Failed to create picker')) && !isOriginOrRedirectError);

  return React.createElement(
    "div",
    { className: "fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 backdrop-blur-md" },
    React.createElement(
      "div",
      { className: "bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md text-center p-8 border border-gray-700 relative" },
      React.createElement(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 text-gray-500 hover:text-white"
        },
        React.createElement(
          "svg",
          { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
          React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
        )
      ),
      !error && React.createElement(
        "div",
        { className: "flex justify-center mb-4" },
        React.createElement(Spinner, null)
      ),
      React.createElement(
        "h2",
        { className: "text-2xl font-bold text-white mb-2" },
        "Google Drive"
      ),
      isOriginOrRedirectError ? (
        React.createElement(
          "div",
          { className: "mt-4 text-left text-sm leading-relaxed p-4 rounded-xl border text-red-300 bg-red-900/30 border-red-500/30" },
          React.createElement(
            "strong",
            { className: "font-bold text-red-200 block mb-2" },
            "Error 400: Configuration Issue (Origin/Redirect Mismatch)"
          ),
          React.createElement(
            "p",
            { className: "mb-3" },
            "Google is rejecting the authentication request. This is usually due to incorrect settings in your Google Cloud Project."
          ),
          React.createElement(
            "ul",
            { className: "list-disc list-inside space-y-2 opacity-80" },
            React.createElement(
              "li",
              null,
              "Ensure your app's origin is listed under ",
              React.createElement("strong", null, "Authorized JavaScript origins"),
              "."
            ),
            React.createElement(
              "li",
              null,
              "Specifically, add this URL: ",
              React.createElement("code", { className: "text-red-200 text-xs font-mono" }, window.location.origin)
            ),
            React.createElement(
              "li",
              null,
              "For some environments, you might also need to add your origin to ",
              React.createElement("strong", null, "Authorized redirect URIs"),
              " (e.g., ",
              React.createElement("code", { className: "text-red-200 text-xs font-mono" }, window.location.origin),
              " or ",
              React.createElement("code", { className: "text-red-200 text-xs font-mono" }, `storagerelay://${window.location.origin}?id=...`),
              " if you see a 'redirect_uri_mismatch' specifically mentioning 'storagerelay'."
            )
          ),
          React.createElement(
            "p",
            { className: "mt-3" },
            "Review your OAuth 2.0 Client ID credentials."
          ),
          React.createElement(
            "div",
            { className: "mt-4 bg-gray-900/50 p-3 rounded-lg flex items-center justify-between border border-red-500/20" },
            React.createElement(
              "code",
              { className: "text-red-200 text-xs font-mono" },
              window.location.origin
            ),
            React.createElement(
              "button",
              {
                type: "button",
                onClick: copyOrigin,
                className: "text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
              },
              showCopySuccess ? 'Copied!' : 'Copy'
            )
          ),
          React.createElement(
            "a",
            { href: "https://console.cloud.google.com/apis/credentials", target: "_blank", rel: "noopener noreferrer", className: "mt-4 inline-block font-bold text-indigo-300 hover:underline" },
            "Open Google Cloud Credentials \u2197"
          )
        )
      ) : isApiKeyInvalidError ? (
        React.createElement(
          "div",
          { className: "mt-4 text-left text-sm leading-relaxed p-4 rounded-xl border text-red-300 bg-red-900/30 border-red-500/30" },
          React.createElement(
            "strong",
            { className: "font-bold text-red-200 block mb-2" },
            "API Key Invalid or Misconfigured"
          ),
          React.createElement(
            "p",
            { className: "mb-3" },
            "Your Google Cloud API Key appears to be invalid or incorrectly configured. This is often due to an incorrect key or missing API enablement."
          ),
          React.createElement(
            "ul",
            { className: "list-disc list-inside space-y-2 opacity-80" },
            React.createElement(
              "li",
              null,
              "Double-check that your API Key is copied correctly without typos."
            ),
            React.createElement(
              "li",
              null,
              "Verify that the ",
              React.createElement("strong", null, "Google Drive API"),
              " is ",
              React.createElement("strong", null, "enabled"),
              " in the Google Cloud Project for this API Key."
            ),
            React.createElement(
              "li",
              null,
              "If you have ",
              React.createElement("strong", null, "API Restrictions"),
              " (e.g., HTTP referers) enabled for this API Key, ensure that ",
              React.createElement("code", { className: "text-red-200 text-xs font-mono" }, window.location.origin),
              " is added to the list of allowed referrers."
            )
          ),
          React.createElement(
            "a",
            { href: "https://console.cloud.google.com/apis/credentials", target: "_blank", rel: "noopener noreferrer", className: "mt-4 inline-block font-bold text-indigo-300 hover:underline" },
            "Open Google Cloud Credentials \u2197"
          )
        )
      ) : ( // Generic error or status
        React.createElement(
          "div",
          { className: `mt-4 text-sm leading-relaxed p-4 rounded-xl border ${error ? 'text-red-300 bg-red-900/30 border-red-500/30' : 'text-gray-400 border-gray-700'}` },
          error || status
        )
      ),
      error &&
        React.createElement(
          "div",
          { className: "mt-6 space-y-3" },
          React.createElement(
            "p",
            { className: "text-xs text-gray-500" },
            "Ensure your Client ID and API Key are from the same Google Cloud project."
          ),
          React.createElement(
            "button",
            {
              onClick: handleResetClientId,
              className: "w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95"
            },
            "Reset & Try New Credentials"
          )
        )
    )
  );
};