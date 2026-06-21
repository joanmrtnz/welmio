const en = {
  common: {
    appName: "Welmio",
    loading: "Loading...",
    retry: "Try again",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
  },

  auth: {
    loginTitle: "Welcome back",
    loginSubtitle: "Sign in to continue with Welmio",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    forgotPassword: "Forgot password?",
    invalidCredentials: "Invalid email or password",

    login: {
      desktopTitle: "Smart Finance, Simple Life",
      desktopSubtitle:
        "Track your money, organize your transactions, and keep your goals moving from one clean dashboard.",
      title: "Welcome back",
      subtitle: "Track your money, goals and habits in one place.",
      email: "Email",
      emailPlaceholder: "example@email.com",
      password: "Password",
      passwordPlaceholder: "Your password",
      forgotPassword: "Forgot password?",
      submit: "Log In",
      loggingIn: "Logging in...",
      noAccount: "Don’t have an account?",
      signUp: "Sign Up",
      showPassword: "Show password",
      hidePassword: "Hide password",
      errors: {
        invalidCredentials: "Invalid email or password",
      },
    },

    signup: {
      desktopHeadline: "Build better money habits from day one.",
      desktopCopy:
        "Create your Welmio account and start organizing expenses, savings goals, and financial routines with a clean dashboard.",
      title: "Create account",
      subtitle: "Start tracking your money, goals and habits in one place.",
      fullNameRequired: "Full Name *",
      fullNamePlaceholder: "John Doe",
      emailRequired: "Email *",
      emailPlaceholder: "example@email.com",
      mobileNumber: "Mobile Number",
      mobileNumberPlaceholder: "+123 456 789",
      dateOfBirth: "Date of Birth",
      dateOfBirthPlaceholder: "DD / MM / YYYY",
      passwordRequired: "Password *",
      passwordPlaceholder: "Your password",
      confirmPasswordRequired: "Confirm Password *",
      confirmPasswordPlaceholder: "Repeat your password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      legal: {
        prefix: "By continuing, you agree to the",
        terms: "Terms of Use",
        and: "and",
        privacy: "Privacy Policy",
      },
      submit: "Sign Up",
      creatingAccount: "Creating account...",
      alreadyHaveAccount: "Already have an account?",
      logIn: "Log in",
      errors: {
        requiredFields: "Fill the required form fields before submitting",
        passwordsDontMatch: "The passwords don't match",
      },
    },

    forgotPasswordScreen: {
      desktopTitle: "Reset your password safely",
      desktopText:
        "We’ll send a secure verification code to your email so you can create a new password.",
      title: "Forgot password?",
      subtitle: "Enter your email and we’ll send you a code to reset your password.",
      email: "Email",
      emailPlaceholder: "example@email.com",
      sendingCode: "Sending code...",
      nextStep: "Next step",
      backToLogin: "Back to Log In",
      noAccount: "Don’t have an account?",
      signUp: "Sign Up",
      errors: {
        emailRequired: "Email is required",
      },
    },
    newPasswordScreen: {
      desktopTitle: "Set a new password",
      desktopText:
        "Choose a strong password to protect your account and keep your financial workspace secure.",
      title: "New password",
      subtitle: "Create a secure new password to recover access to your account.",
      newPassword: "New password",
      newPasswordPlaceholder: "Your new password",
      confirmNewPassword: "Confirm new password",
      confirmNewPasswordPlaceholder: "Repeat your new password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      updating: "Updating...",
      changePassword: "Change password",
      backToLogin: "Back to Log In",
      noAccount: "Don’t have an account?",
      signUp: "Sign Up",
      errors: {
        missingEmailOrCode: "Missing email or code",
        passwordTooShort: "Password must be at least 6 characters",
        passwordsDontMatch: "Passwords do not match",
      },
    },
    verifyCodeScreen: {
      desktopTitle: "Confirm your recovery code",
      desktopText:
        "Enter the verification code from your email to keep your password reset secure.",
      title: "Verify code",
      subtitle: "Enter the recovery code we sent to your email to continue.",
      recoveryCode: "Recovery code",
      codePlaceholder: "Enter your code",
      checking: "Checking...",
      accept: "Accept",
      sending: "Sending...",
      sendAgain: "Send again",
      backToLogin: "Back to Log In",
      noAccount: "Don’t have an account?",
      signUp: "Sign Up",
      errors: {
        emailMissing: "Email is missing",
        codeRequired: "Recovery code is required",
      },
    },
    fingerprintScreen: {
      desktopTitle: "Secure access in one touch",
      desktopSubtitle:
        "Keep your financial dashboard protected while making sign in fast and effortless on trusted devices.",
      title: "Use Touch ID",
      subtitle:
        "Unlock Welmio faster and keep your account protected with biometric access.",
      infoTitle: "Secure access",
      infoText:
        "Your fingerprint stays on this device and is never shared with Welmio.",
      useTouchId: "Use Touch ID",
      usePinInstead: "Use PIN code instead",
    },
    successMessageScreen: {
      desktopHeadline: "Your account is secure",
      desktopText:
        "Your password was changed successfully. You will be redirected to sign in again with your new credentials.",
      title: "Password Changed",
      subtitle: "Your password has been updated successfully",
    },
  },

  profile: {
    title: "Profile",
    appVersion: "App version",
    logout: "Log out",
  },

  goals: {
    title: "Goals",
    createGoal: "Create goal",
    targetAmount: "Target amount",
  },

  transactions: {
    title: "Transactions",
    income: "Income",
    expense: "Expense",
  },
};

export default en;