
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
        picker.setVisible(true);
    } catch (err) {
        setError('Failed to create picker. Check if the API Key has the Drive API enabled and no strict restrictions.');
    }
  }, [pickerCallback, apiKey]);
  
  useEffect(() => {
    // Log the Client ID being used for this authentication attempt.
    console.log("Using Google Client ID for authentication:", clientId);

    const initializeAndAuth = () => {
        setStatus('Loading Google API...');
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
                            
                            if (tokenResponse.error === 'invalid_request') {
                                detailedError = "Error 400: Origin mismatch or wrong Project ID. Check Google Console origins.";
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
                setError(`GSI Client Error: ${err.message}`);
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

  const isOriginError = error?.includes('Error 400');

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
      isOriginError ? (
        React.createElement(
          "div",
          { className: "mt-4 text-left text-sm leading-relaxed p-4 rounded-xl border text-red-300 bg-red-900/30 border-red-500/30" },
          React.createElement(
            "strong",
            { className: "font-bold text-red-200 block mb-2" },
            "Error 400: Configuration Error"
          ),
          React.createElement(
            "p",
            { className: "mb-3" },
            "This usually means your app's URL is not whitelisted in your Google Cloud Project."
          ),
          React.createElement(
            "p",
            { className: "mb-1 text-xs text-red-200/70" },
            "Required URL:"
          ),
          React.createElement(
            "div",
            { className: "bg-gray-900/50 p-3 rounded-lg flex items-center justify-between border border-red-500/20" },
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
            "p",
            { className: "mt-3" },
            "Please add this exact URL to your project's ",
            React.createElement(
              "strong",
              null,
              "Authorized JavaScript origins"
            ),
            " list."
          ),
          React.createElement(
            "a",
            { href: "https://console.cloud.google.com/apis/credentials", target: "_blank", rel: "noopener noreferrer", className: "mt-4 inline-block font-bold text-indigo-300 hover:underline" },
            "Open Google Cloud Credentials \u2197"
          )
        )
      ) : (
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