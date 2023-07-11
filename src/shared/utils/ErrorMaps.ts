import { FirestoreErrorCode } from 'firebase/firestore'

export const enum AuthErrorCode {
  ADMIN_ONLY_OPERATION = 'admin-restricted-operation',
  ARGUMENT_ERROR = 'argument-error',
  APP_NOT_AUTHORIZED = 'app-not-authorized',
  APP_NOT_INSTALLED = 'app-not-installed',
  CAPTCHA_CHECK_FAILED = 'captcha-check-failed',
  CODE_EXPIRED = 'code-expired',
  CORDOVA_NOT_READY = 'cordova-not-ready',
  CORS_UNSUPPORTED = 'cors-unsupported',
  CREDENTIAL_ALREADY_IN_USE = 'credential-already-in-use',
  CREDENTIAL_MISMATCH = 'custom-token-mismatch',
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN = 'requires-recent-login',
  DEPENDENT_SDK_INIT_BEFORE_AUTH = 'dependent-sdk-initialized-before-auth',
  DYNAMIC_LINK_NOT_ACTIVATED = 'dynamic-link-not-activated',
  EMAIL_CHANGE_NEEDS_VERIFICATION = 'email-change-needs-verification',
  EMAIL_EXISTS = 'email-already-in-use',
  EMULATOR_CONFIG_FAILED = 'emulator-config-failed',
  EXPIRED_OOB_CODE = 'expired-action-code',
  EXPIRED_POPUP_REQUEST = 'cancelled-popup-request',
  INTERNAL_ERROR = 'internal-error',
  INVALID_API_KEY = 'invalid-api-key',
  INVALID_APP_CREDENTIAL = 'invalid-app-credential',
  INVALID_APP_ID = 'invalid-app-id',
  INVALID_AUTH = 'invalid-user-token',
  INVALID_AUTH_EVENT = 'invalid-auth-event',
  INVALID_CERT_HASH = 'invalid-cert-hash',
  INVALID_CODE = 'invalid-verification-code',
  INVALID_CONTINUE_URI = 'invalid-continue-uri',
  INVALID_CORDOVA_CONFIGURATION = 'invalid-cordova-configuration',
  INVALID_CUSTOM_TOKEN = 'invalid-custom-token',
  INVALID_DYNAMIC_LINK_DOMAIN = 'invalid-dynamic-link-domain',
  INVALID_EMAIL = 'invalid-email',
  INVALID_EMULATOR_SCHEME = 'invalid-emulator-scheme',
  INVALID_IDP_RESPONSE = 'invalid-credential',
  INVALID_MESSAGE_PAYLOAD = 'invalid-message-payload',
  INVALID_MFA_SESSION = 'invalid-multi-factor-session',
  INVALID_OAUTH_CLIENT_ID = 'invalid-oauth-client-id',
  INVALID_OAUTH_PROVIDER = 'invalid-oauth-provider',
  INVALID_OOB_CODE = 'invalid-action-code',
  INVALID_ORIGIN = 'unauthorized-domain',
  INVALID_PASSWORD = 'wrong-password',
  INVALID_PERSISTENCE = 'invalid-persistence-type',
  INVALID_PHONE_NUMBER = 'invalid-phone-number',
  INVALID_PROVIDER_ID = 'invalid-provider-id',
  INVALID_RECIPIENT_EMAIL = 'invalid-recipient-email',
  INVALID_SENDER = 'invalid-sender',
  INVALID_SESSION_INFO = 'invalid-verification-id',
  INVALID_TENANT_ID = 'invalid-tenant-id',
  LOGIN_BLOCKED = 'login-blocked',
  MFA_INFO_NOT_FOUND = 'multi-factor-info-not-found',
  MFA_REQUIRED = 'multi-factor-auth-required',
  MISSING_ANDROID_PACKAGE_NAME = 'missing-android-pkg-name',
  MISSING_APP_CREDENTIAL = 'missing-app-credential',
  MISSING_AUTH_DOMAIN = 'auth-domain-config-required',
  MISSING_CODE = 'missing-verification-code',
  MISSING_CONTINUE_URI = 'missing-continue-uri',
  MISSING_IFRAME_START = 'missing-iframe-start',
  MISSING_IOS_BUNDLE_ID = 'missing-ios-bundle-id',
  MISSING_OR_INVALID_NONCE = 'missing-or-invalid-nonce',
  MISSING_MFA_INFO = 'missing-multi-factor-info',
  MISSING_MFA_SESSION = 'missing-multi-factor-session',
  MISSING_PHONE_NUMBER = 'missing-phone-number',
  MISSING_PASSWORD = 'missing-password',
  MISSING_SESSION_INFO = 'missing-verification-id',
  MODULE_DESTROYED = 'app-deleted',
  NEED_CONFIRMATION = 'account-exists-with-different-credential',
  NETWORK_REQUEST_FAILED = 'network-request-failed',
  NULL_USER = 'null-user',
  NO_AUTH_EVENT = 'no-auth-event',
  NO_SUCH_PROVIDER = 'no-such-provider',
  OPERATION_NOT_ALLOWED = 'operation-not-allowed',
  OPERATION_NOT_SUPPORTED = 'operation-not-supported-in-this-environment',
  POPUP_BLOCKED = 'popup-blocked',
  POPUP_CLOSED_BY_USER = 'popup-closed-by-user',
  PROVIDER_ALREADY_LINKED = 'provider-already-linked',
  QUOTA_EXCEEDED = 'quota-exceeded',
  REDIRECT_CANCELLED_BY_USER = 'redirect-cancelled-by-user',
  REDIRECT_OPERATION_PENDING = 'redirect-operation-pending',
  REJECTED_CREDENTIAL = 'rejected-credential',
  SECOND_FACTOR_ALREADY_ENROLLED = 'second-factor-already-in-use',
  SECOND_FACTOR_LIMIT_EXCEEDED = 'maximum-second-factor-count-exceeded',
  TENANT_ID_MISMATCH = 'tenant-id-mismatch',
  TIMEOUT = 'timeout',
  TOKEN_EXPIRED = 'user-token-expired',
  TOO_MANY_ATTEMPTS_TRY_LATER = 'too-many-requests',
  UNAUTHORIZED_DOMAIN = 'unauthorized-continue-uri',
  UNSUPPORTED_FIRST_FACTOR = 'unsupported-first-factor',
  UNSUPPORTED_PERSISTENCE = 'unsupported-persistence-type',
  UNSUPPORTED_TENANT_OPERATION = 'unsupported-tenant-operation',
  UNVERIFIED_EMAIL = 'unverified-email',
  USER_CANCELLED = 'user-cancelled',
  USER_DELETED = 'user-not-found',
  USER_DISABLED = 'user-disabled',
  USER_MISMATCH = 'user-mismatch',
  USER_SIGNED_OUT = 'user-signed-out',
  WEAK_PASSWORD = 'weak-password',
  WEB_STORAGE_UNSUPPORTED = 'web-storage-unsupported',
  ALREADY_INITIALIZED = 'already-initialized',
  RECAPTCHA_NOT_ENABLED = 'recaptcha-not-enabled',
  MISSING_RECAPTCHA_TOKEN = 'missing-recaptcha-token',
  INVALID_RECAPTCHA_TOKEN = 'invalid-recaptcha-token',
  INVALID_RECAPTCHA_ACTION = 'invalid-recaptcha-action',
  MISSING_CLIENT_TYPE = 'missing-client-type',
  MISSING_RECAPTCHA_VERSION = 'missing-recaptcha-version',
  INVALID_RECAPTCHA_VERSION = 'invalid-recaptcha-version',
  INVALID_REQ_TYPE = 'invalid-req-type'
}
/* https://github.com/firebase/firebase-js-sdk/blob/534047b4b8e75c2816793aa1599ceb0310a939ec/packages/auth/src/core/errors.ts#L138 */
export const authErrors = {
  [AuthErrorCode.ADMIN_ONLY_OPERATION]:
    'This operation is restricted to administrators only.',
  [AuthErrorCode.ARGUMENT_ERROR]: '',
  [AuthErrorCode.APP_NOT_AUTHORIZED]:
    "This app, identified by the domain where it's hosted, is not " +
    'authorized to use Firebase Authentication with the provided API key. ' +
    'Review your key configuration in the Google API console.',
  [AuthErrorCode.APP_NOT_INSTALLED]:
    'The requested mobile application corresponding to the identifier (' +
    'Android package name or iOS bundle ID) provided is not installed on ' +
    'this device.',
  [AuthErrorCode.CAPTCHA_CHECK_FAILED]:
    'The reCAPTCHA response token provided is either invalid, expired, ' +
    'already used or the domain associated with it does not match the list ' +
    'of whitelisted domains.',
  [AuthErrorCode.CODE_EXPIRED]:
    'The SMS code has expired. Please re-send the verification code to try ' +
    'again.',
  [AuthErrorCode.CORDOVA_NOT_READY]: 'Cordova framework is not ready.',
  [AuthErrorCode.CORS_UNSUPPORTED]: 'This browser is not supported.',
  [AuthErrorCode.CREDENTIAL_ALREADY_IN_USE]:
    'This credential is already associated with a different user account.',
  [AuthErrorCode.CREDENTIAL_MISMATCH]:
    'The custom token corresponds to a different audience.',
  [AuthErrorCode.CREDENTIAL_TOO_OLD_LOGIN_AGAIN]:
    'This operation is sensitive and requires recent authentication. Log in ' +
    'again before retrying this request.',
  [AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH]:
    'Another Firebase SDK was initialized and is trying to use Auth before Auth is ' +
    'initialized. Please be sure to call `initializeAuth` or `getAuth` before ' +
    'starting any other Firebase SDK.',
  [AuthErrorCode.DYNAMIC_LINK_NOT_ACTIVATED]:
    'Please activate Dynamic Links in the Firebase Console and agree to the terms and ' +
    'conditions.',
  [AuthErrorCode.EMAIL_CHANGE_NEEDS_VERIFICATION]:
    'Multi-factor users must always have a verified email.',
  [AuthErrorCode.EMAIL_EXISTS]:
    'The email address is already in use by another account.',
  [AuthErrorCode.EMULATOR_CONFIG_FAILED]:
    'Auth instance has already been used to make a network call. Auth can ' +
    'no longer be configured to use the emulator. Try calling ' +
    '"connectAuthEmulator()" sooner.',
  [AuthErrorCode.EXPIRED_OOB_CODE]: 'The action code has expired.',
  [AuthErrorCode.EXPIRED_POPUP_REQUEST]:
    'This operation has been cancelled due to another conflicting popup being opened.',
  [AuthErrorCode.INTERNAL_ERROR]: 'An internal AuthError has occurred.',
  [AuthErrorCode.INVALID_APP_CREDENTIAL]:
    'The phone verification request contains an invalid application verifier.' +
    ' The reCAPTCHA token response is either invalid or expired.',
  [AuthErrorCode.INVALID_APP_ID]:
    'The mobile app identifier is not registed for the current project.',
  [AuthErrorCode.INVALID_AUTH]:
    "This user's credential isn't valid for this project. This can happen " +
    "if the user's token has been tampered with, or if the user isn't for " +
    'the project associated with this API key.',
  [AuthErrorCode.INVALID_AUTH_EVENT]: 'An internal AuthError has occurred.',
  [AuthErrorCode.INVALID_CODE]:
    'The SMS verification code used to create the phone auth credential is ' +
    'invalid. Please resend the verification code sms and be sure to use the ' +
    'verification code provided by the user.',
  [AuthErrorCode.INVALID_CONTINUE_URI]:
    'The continue URL provided in the request is invalid.',
  [AuthErrorCode.INVALID_CORDOVA_CONFIGURATION]:
    'The following Cordova plugins must be installed to enable OAuth sign-in: ' +
    'cordova-plugin-buildinfo, cordova-universal-links-plugin, ' +
    'cordova-plugin-browsertab, cordova-plugin-inappbrowser and ' +
    'cordova-plugin-customurlscheme.',
  [AuthErrorCode.INVALID_CUSTOM_TOKEN]:
    'The custom token format is incorrect. Please check the documentation.',
  [AuthErrorCode.INVALID_DYNAMIC_LINK_DOMAIN]:
    'The provided dynamic link domain is not configured or authorized for the current project.',
  [AuthErrorCode.INVALID_EMAIL]: 'The email address is badly formatted.',
  [AuthErrorCode.INVALID_EMULATOR_SCHEME]:
    'Emulator URL must start with a valid scheme (http:// or https://).',
  [AuthErrorCode.INVALID_API_KEY]:
    'Your API key is invalid, please check you have copied it correctly.',
  [AuthErrorCode.INVALID_CERT_HASH]:
    'The SHA-1 certificate hash provided is invalid.',
  [AuthErrorCode.INVALID_IDP_RESPONSE]:
    'The supplied auth credential is malformed or has expired.',
  [AuthErrorCode.INVALID_MESSAGE_PAYLOAD]:
    'The email template corresponding to this action contains invalid characters in its message. ' +
    'Please fix by going to the Auth email templates section in the Firebase Console.',
  [AuthErrorCode.INVALID_MFA_SESSION]:
    'The request does not contain a valid proof of first factor successful sign-in.',
  [AuthErrorCode.INVALID_OAUTH_PROVIDER]:
    'EmailAuthProvider is not supported for this operation. This operation ' +
    'only supports OAuth providers.',
  [AuthErrorCode.INVALID_OAUTH_CLIENT_ID]:
    'The OAuth client ID provided is either invalid or does not match the ' +
    'specified API key.',
  [AuthErrorCode.INVALID_ORIGIN]:
    'This domain is not authorized for OAuth operations for your Firebase ' +
    'project. Edit the list of authorized domains from the Firebase console.',
  [AuthErrorCode.INVALID_OOB_CODE]:
    'The action code is invalid. This can happen if the code is malformed, ' +
    'expired, or has already been used.',
  [AuthErrorCode.INVALID_PASSWORD]:
    'The password is invalid or the user does not have a password.',
  [AuthErrorCode.INVALID_PERSISTENCE]:
    'The specified persistence type is invalid. It can only be local, session or none.',
  [AuthErrorCode.INVALID_PHONE_NUMBER]:
    'The format of the phone number provided is incorrect. Please enter the ' +
    'phone number in a format that can be parsed into E.164 format. E.164 ' +
    'phone numbers are written in the format [+][country code][subscriber ' +
    'number including area code].',
  [AuthErrorCode.INVALID_PROVIDER_ID]:
    'The specified provider ID is invalid.',
  [AuthErrorCode.INVALID_RECIPIENT_EMAIL]:
    'The email corresponding to this action failed to send as the provided ' +
    'recipient email address is invalid.',
  [AuthErrorCode.INVALID_SENDER]:
    'The email template corresponding to this action contains an invalid sender email or name. ' +
    'Please fix by going to the Auth email templates section in the Firebase Console.',
  [AuthErrorCode.INVALID_SESSION_INFO]:
    'The verification ID used to create the phone auth credential is invalid.',
  [AuthErrorCode.INVALID_TENANT_ID]:
    "The Auth instance's tenant ID is invalid.",
  [AuthErrorCode.LOGIN_BLOCKED]:
    'Login blocked by user-provided method: {$originalMessage}',
  [AuthErrorCode.MISSING_ANDROID_PACKAGE_NAME]:
    'An Android Package Name must be provided if the Android App is required to be installed.',
  [AuthErrorCode.MISSING_AUTH_DOMAIN]:
    'Be sure to include authDomain when calling firebase.initializeApp(), ' +
    'by following the instructions in the Firebase console.',
  [AuthErrorCode.MISSING_APP_CREDENTIAL]:
    'The phone verification request is missing an application verifier ' +
    'assertion. A reCAPTCHA response token needs to be provided.',
  [AuthErrorCode.MISSING_CODE]:
    'The phone auth credential was created with an empty SMS verification code.',
  [AuthErrorCode.MISSING_CONTINUE_URI]:
    'A continue URL must be provided in the request.',
  [AuthErrorCode.MISSING_IFRAME_START]: 'An internal AuthError has occurred.',
  [AuthErrorCode.MISSING_IOS_BUNDLE_ID]:
    'An iOS Bundle ID must be provided if an App Store ID is provided.',
  [AuthErrorCode.MISSING_OR_INVALID_NONCE]:
    'The request does not contain a valid nonce. This can occur if the ' +
    'SHA-256 hash of the provided raw nonce does not match the hashed nonce ' +
    'in the ID token payload.',
  [AuthErrorCode.MISSING_PASSWORD]: 'A non-empty password must be provided',
  [AuthErrorCode.MISSING_MFA_INFO]:
    'No second factor identifier is provided.',
  [AuthErrorCode.MISSING_MFA_SESSION]:
    'The request is missing proof of first factor successful sign-in.',
  [AuthErrorCode.MISSING_PHONE_NUMBER]:
    'To send verification codes, provide a phone number for the recipient.',
  [AuthErrorCode.MISSING_SESSION_INFO]:
    'The phone auth credential was created with an empty verification ID.',
  [AuthErrorCode.MODULE_DESTROYED]:
    'This instance of FirebaseApp has been deleted.',
  [AuthErrorCode.MFA_INFO_NOT_FOUND]:
    'The user does not have a second factor matching the identifier provided.',
  [AuthErrorCode.MFA_REQUIRED]:
    'Proof of ownership of a second factor is required to complete sign-in.',
  [AuthErrorCode.NEED_CONFIRMATION]:
    'An account already exists with the same email address but different ' +
    'sign-in credentials. Sign in using a provider associated with this ' +
    'email address.',
  [AuthErrorCode.NETWORK_REQUEST_FAILED]:
    'A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.',
  [AuthErrorCode.NO_AUTH_EVENT]: 'An internal AuthError has occurred.',
  [AuthErrorCode.NO_SUCH_PROVIDER]:
    'User was not linked to an account with the given provider.',
  [AuthErrorCode.NULL_USER]:
    'A null user object was provided as the argument for an operation which ' +
    'requires a non-null user object.',
  [AuthErrorCode.OPERATION_NOT_ALLOWED]:
    'The given sign-in provider is disabled for this Firebase project. ' +
    'Enable it in the Firebase console, under the sign-in method tab of the ' +
    'Auth section.',
  [AuthErrorCode.OPERATION_NOT_SUPPORTED]:
    'This operation is not supported in the environment this application is ' +
    'running on. "location.protocol" must be http, https or chrome-extension' +
    ' and web storage must be enabled.',
  [AuthErrorCode.POPUP_BLOCKED]:
    'Unable to establish a connection with the popup. It may have been blocked by the browser.',
  [AuthErrorCode.POPUP_CLOSED_BY_USER]:
    'The popup has been closed by the user before finalizing the operation.',
  [AuthErrorCode.PROVIDER_ALREADY_LINKED]:
    'User can only be linked to one identity for the given provider.',
  [AuthErrorCode.QUOTA_EXCEEDED]:
    "The project's quota for this operation has been exceeded.",
  [AuthErrorCode.REDIRECT_CANCELLED_BY_USER]:
    'The redirect operation has been cancelled by the user before finalizing.',
  [AuthErrorCode.REDIRECT_OPERATION_PENDING]:
    'A redirect sign-in operation is already pending.',
  [AuthErrorCode.REJECTED_CREDENTIAL]:
    'The request contains malformed or mismatching credentials.',
  [AuthErrorCode.SECOND_FACTOR_ALREADY_ENROLLED]:
    'The second factor is already enrolled on this account.',
  [AuthErrorCode.SECOND_FACTOR_LIMIT_EXCEEDED]:
    'The maximum allowed number of second factors on a user has been exceeded.',
  [AuthErrorCode.TENANT_ID_MISMATCH]:
    "The provided tenant ID does not match the Auth instance's tenant ID",
  [AuthErrorCode.TIMEOUT]: 'The operation has timed out.',
  [AuthErrorCode.TOKEN_EXPIRED]:
    "The user's credential is no longer valid. The user must sign in again.",
  [AuthErrorCode.TOO_MANY_ATTEMPTS_TRY_LATER]:
    'We have blocked all requests from this device due to unusual activity. ' +
    'Try again later.',
  [AuthErrorCode.UNAUTHORIZED_DOMAIN]:
    'The domain of the continue URL is not whitelisted.  Please whitelist ' +
    'the domain in the Firebase console.',
  [AuthErrorCode.UNSUPPORTED_FIRST_FACTOR]:
    'Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.',
  [AuthErrorCode.UNSUPPORTED_PERSISTENCE]:
    'The current environment does not support the specified persistence type.',
  [AuthErrorCode.UNSUPPORTED_TENANT_OPERATION]:
    'This operation is not supported in a multi-tenant context.',
  [AuthErrorCode.UNVERIFIED_EMAIL]:
    'The operation requires a verified email.',
  [AuthErrorCode.USER_CANCELLED]:
    'The user did not grant your application the permissions it requested.',
  [AuthErrorCode.USER_DELETED]:
    'There is no user record corresponding to this identifier. The user may ' +
    'have been deleted.',
  [AuthErrorCode.USER_DISABLED]:
    'The user account has been disabled by an administrator.',
  [AuthErrorCode.USER_MISMATCH]:
    'The supplied credentials do not correspond to the previously signed in user.',
  [AuthErrorCode.USER_SIGNED_OUT]: '',
  [AuthErrorCode.WEAK_PASSWORD]:
    'The password must be 6 characters long or more.',
  [AuthErrorCode.WEB_STORAGE_UNSUPPORTED]:
    'This browser is not supported or 3rd party cookies and data may be disabled.',
  [AuthErrorCode.ALREADY_INITIALIZED]:
    'initializeAuth() has already been called with ' +
    'different options. To avoid this error, call initializeAuth() with the ' +
    'same options as when it was originally called, or call getAuth() to return the' +
    ' already initialized instance.',
  [AuthErrorCode.MISSING_RECAPTCHA_TOKEN]:
    'The reCAPTCHA token is missing when sending request to the backend.',
  [AuthErrorCode.INVALID_RECAPTCHA_TOKEN]:
    'The reCAPTCHA token is invalid when sending request to the backend.',
  [AuthErrorCode.INVALID_RECAPTCHA_ACTION]:
    'The reCAPTCHA action is invalid when sending request to the backend.',
  [AuthErrorCode.RECAPTCHA_NOT_ENABLED]:
    'reCAPTCHA Enterprise integration is not enabled for this project.',
  [AuthErrorCode.MISSING_CLIENT_TYPE]:
    'The reCAPTCHA client type is missing when sending request to the backend.',
  [AuthErrorCode.MISSING_RECAPTCHA_VERSION]:
    'The reCAPTCHA version is missing when sending request to the backend.',
  [AuthErrorCode.INVALID_REQ_TYPE]: 'Invalid request parameters.',
  [AuthErrorCode.INVALID_RECAPTCHA_VERSION]:
    'The reCAPTCHA version is invalid when sending request to the backend.'
}


export const firestoreErrors: Record<FirestoreErrorCode, string> = {
  'cancelled': 'The operation was cancelled (typically by the caller).',
  'unknown': 'Unknown error or an error from a different error domain.',
  'invalid-argument': 'Client specified an invalid argument (e.g. an invalid field name).',
  'deadline-exceeded': 'Deadline expired before operation could complete.',
  'not-found': 'Some requested document was not found.',
  'already-exists': 'Some document that we attempted to create already exists.',
  'permission-denied': 'The caller does not have permission to execute the specified operation.',
  'resource-exhausted': 'Some resource has been exhausted, perhaps a per-user quota, or perhaps the entire file system is out of space.',
  'failed-precondition': 'Operation was rejected because the system is not in a state required for the operation\'s execution.',
  'aborted': 'The operation was aborted, typically due to a concurrency issue like transaction aborts, etc.',
  'out-of-range': 'Operation was attempted past the valid range.',
  'unimplemented': 'Operation is not implemented or not supported/enabled.',
  'internal': 'Internal errors. Means some invariants expected by underlying system has been broken. If you see one of these errors, something is very broken.',
  'unavailable': 'The service is currently unavailable. This is most likely a transient condition and may be corrected by retrying with a backoff.',
  'data-loss': 'Unrecoverable data loss or corruption.',
  'unauthenticated': 'The request does not have valid authentication credentials for the operation.'
}


export const storageErrors = {
  'storage/unknown': 'An unknown error occurred.',
  'storage/object-not-found': 'No object exists at the desired reference.',
  'storage/bucket-not-found': 'No bucket is configured for Cloud Storage',
  'storage/project-not-found': 'No project is configured for Cloud Storage',
  'storage/quota-exceeded': "Quota on your Cloud Storage bucket has been exceeded. If you're on the no-cost tier, upgrade to a paid plan.",
  'storage/unauthenticated': 'User is unauthenticated, please authenticate and try again.',
  'storage/unauthorized': 'User is not authorized to perform the desired action, check your security rules to ensure they are correct.',
  'storage/retry-limit-exceeded': 'The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again.',
  'storage/invalid-checksum': 'File on the client does not match the checksum of the file received by the server. Try uploading again.',
  'storage/canceled': 'User canceled the operation.',
  'storage/invalid-event-name': "Invalid event name provided. Must be one of ['running', 'progress', 'pause']",
  'storage/invalid-url': 'Invalid URL provided to refFromURL(). Must be of the form: gs://bucket/object or https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token=<TOKEN>',
  'storage/invalid-argument': 'The argument passed to put() must be File, Blob, or UInt8 Array. The argument passed to putString() must be a raw, Base64, or Base64URL string.',
  'storage/no-default-bucket': "No bucket has been set in your config's storageBucket property.",
  'storage/cannot-slice-blob': "Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn't changed.",
  'storage/server-file-wrong-size': 'File on the client does not match the size of the file recieved by the server. Try uploading again.',
}
