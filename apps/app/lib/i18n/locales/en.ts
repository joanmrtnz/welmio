const en = {
  common: {
    appName: "Welmio",
    loading: "Loading...",
    retry: "Try again",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    weekDays: {
        mon: "Mo",
        tue: "Tu",
        wed: "We",
        thu: "Th",
        fri: "Fr",
        sat: "Sa",
        sun: "Su",
      },
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

  home: {
    greeting: "Hi, %{name}",
    defaultUser: "User",

    greetings: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },

    sections: {
      overview: "Overview",
      goals: "Goals",
      analytics: "Analytics",
      recentTransactions: "Recent Transactions",
    },

    actions: {
      viewAll: "View All",
    },

    overview: {
      totalBalance: "Total Balance",
      totalExpense: "Total Expense",
    },

    analytics: {
      thisWeekChart: "This week chart",
      weekly: "Weekly",
    },

    transactions: {
      empty: "No recent transactions yet.",
    },

    errors: {
      loadGoals: "Could not load goals.",
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

    summary: {
      totalSaved: "Total Saved",
      targetAmount: "Target Amount",
    },

    progress: {
      loading: "Loading goals...",
      empty: "No goals yet.",
      saved: "You have saved %{percent}% of your total target.",
    },

    mainGoal: {
      eyebrow: "Main Goal",
      savedOf: "saved of %{amount}",
      targetDate: "Target date · %{date}",
    },

    empty: {
      title: "No goals yet",
      description: "Create your first goal to start tracking your progress.",
    },

    pace: {
      monthlyNeeded: "Monthly Needed",
      activeGoals: "Active Goals",
    },

    list: {
      title: "My Goals",
      savedAmount: "%{amount} saved",
    },

    filters: {
      active: "Active",
    },

    actions: {
      newGoal: "New goal",
    },

    smartTip: {
      title: "Smart tip",
      withMainGoal:
        "You need around %{amount} per month to reach your %{goalName} goal on time.",
      empty: "Create a goal to receive simple progress tips.",
    },

    statusLabels: {
      active: "Active",
      completed: "Completed",
      paused: "Paused",
      archived: "Archived",
      overdue: "Overdue",
      in_progress: "In progress",
    },

    contributions: {
      defaultDescription: "Contribution to %{goalName}",
      defaultNotes: "Goal contribution · %{goalName}",
    },

    feedback: {
      createSuccess: "Goal created successfully.",
      createError: "Could not create goal.",
      updateSuccess: "Goal updated successfully.",
      updateError: "Could not update goal.",
      deleteSuccess: "Goal deleted successfully.",
      deleteError: "Could not delete goal.",
      loadError: "Could not load goals.",
      contributionDeleteSuccess: "Contribution removed successfully.",
      contributionDeleteError: "Could not remove contribution.",
    },

    details: {
      title: "Goal Details",
      noDeadline: "No deadline",
      completed: "completed",
      saved: "Saved",
      target: "Target",
      remaining: "Remaining",
      monthlyNeeded: "Monthly needed",
      progressInsight: "Progress insight",
      progressInsightText:
        "You have saved %{saved} of %{target}. To reach this goal on time, you need around %{monthlyNeeded} per month.",
      contributionSingular: "contribution",
      contributionPlural: "contributions",
      editGoal: "Edit goal",
      delete: "Delete",

      goalTypes: {
        emergency_fund: "Emergency fund",
        savings: "Savings",
        purchase: "Purchase",
        trip: "Trip",
        investment: "Investment",
        debt_payment: "Debt payment",
        education: "Education",
        home: "Home",
        car: "Car",
        other: "Other",
      },

      contributions: {
        title: "Recent contributions",
        subtitle: "Latest money added to this goal",
        loading: "Loading contributions...",
        loadError: "Could not load contributions.",
        empty:
          "No contributions yet. Add your first one to start tracking this goal.",
        defaultTitle: "Goal contribution",
      },

      deleteDialog: {
        title: "Delete Goal",
        message:
          "Are you sure you want to delete this goal?\nThis action cannot be undone.",
        messageWithContributions:
          "Are you sure you want to delete this goal?\nThis will also delete %{count} %{contributionLabel} linked to this goal.\nThis action cannot be undone.",
        confirmLabel: "Yes, Delete",
        cancelLabel: "Cancel",
        loadingLabel: "Deleting...",
      },

      deleteContributionDialog: {
        title: "Delete Contribution",
        message:
          "Are you sure you want to delete this contribution?\nThis will remove it from the goal progress, but the linked transaction will not be deleted.",
        confirmLabel: "Yes, Delete",
        cancelLabel: "Cancel",
        loadingLabel: "Deleting...",
      },
    },

    createModal: {
      createTitle: "Create Goal",
      editTitle: "Edit Goal",

      preview: {
        new: "New goal",
        editing: "Editing goal",
        target: "Target · %{amount}",
        defaultTargetAmount: "€30,000",
      },

      fields: {
        goalName: "Goal name",
        targetAmount: "Target amount",
        currentSaved: "Current saved",
        targetDate: "Target date",
        goalType: "Goal type",
        icon: "Icon",
      },

      placeholders: {
        name: "House Deposit",
        targetAmount: "30000",
        currentSaved: "9000",
        targetDate: "2027-12-31",
      },

      actions: {
        createGoal: "Create goal",
        creating: "Creating...",
        saveChanges: "Save changes",
        saving: "Saving...",
      },

      errors: {
        nameRequired: "Goal name is required.",
        targetAmountInvalid: "Target amount must be greater than 0.",
        currentAmountInvalid: "Current amount must be 0 or greater.",
        currentGreaterThanTarget:
          "Current amount cannot be greater than target amount.",
      },
    },

    quickGoals: {
      savedOf: "%{saved} of %{target}",
      emptyTitle: "No goals yet",
      emptyDescription: "Create your first goal to start tracking progress.",
    },
  },

  transactions: {
    title: "Transactions",
    income: "Income",
    expense: "Expense",
    totalBalance: "Total Balance",

    feedback: {
      deleteSuccess: "Transaction deleted successfully",
      deleteError: "Error deleting transaction",
    },

    types: {
      income: "Income",
      expense: "Expense",
    },

    details: {
      title: "Transaction details",
      category: "Category",
      account: "Account",
      currency: "Currency",
      nature: "Nature",
      frequency: "Frequency",
      date: "Date",
      notes: "Notes",
      notSet: "Not set",
      noNotesAdded: "No notes added.",
      edit: "Edit",
      delete: "Delete",

      deleteDialog: {
        title: "Delete Transaction",
        message:
          "Are you sure you want to delete this transaction?\nThis action cannot be undone.",
        confirmLabel: "Yes, Delete",
        cancelLabel: "Cancel",
        loadingLabel: "Deleting...",
      },
    },

    form: {
      newTitle: "New Transaction",
      editTitle: "Edit Transaction",
      type: "Type",
      incomeContribution: "Income contribution",
      date: "Date",
      datePlaceholder: "DD / MM / YYYY",
      amount: "Amount",
      amountPlaceholder: "30.00",
      description: "Description",
      descriptionPlaceholder: "Cinema",
      category: "Category",
      account: "Account",
      nature: "Nature",
      frequency: "Frequency",
      notes: "Notes",
      notesPlaceholder: "Enter message",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      update: "Update",
      updating: "Updating...",

      natureOptions: {
        fixed: "Fixed",
        variable: "Variable",
        essential: "Essential",
        non_essential: "Non-essential",
        need: "Need",
        want: "Want",
        saving: "Saving",
        investment: "Investment",
      },

      frequencyOptions: {
        one_time: "One-time",
        recurring: "Recurring",
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly",
      },

      accountTypes: {
        cash: "Cash",
        bank: "Bank",
        debit: "Debit",
        credit: "Credit",
        savings: "Savings",
        investment: "Investment",
        wallet: "Wallet",
      },
    },

    categoryFilter: {
      title: "Filter by category",
      addMoreCategories: "Add more categories",
      clear: "Clear",
      applyFilter: "Apply filter",
      editCategory: "Edit Category",
      newCategory: "New Category",
      categoryNamePlaceholder: "Category name",
      type: "Type",
      icon: "Icon",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      saveChanges: "Save changes",

      deleteDialog: {
        title: "Delete Category",
        singleMessage:
          "Are you sure you want to delete this category?\nThis action cannot be undone.",
        multipleMessage:
          "Are you sure you want to delete these categories?\nThis action cannot be undone.",
        singleConfirmLabel: "Yes, Delete",
        multipleConfirmLabel: "Yes, Delete All",
        cancelLabel: "Cancel",
        loadingLabel: "Deleting...",
      },
    },

    calendarFilter: {
      title: "Filter by date",
      clear: "Clear",
      applyFilter: "Apply filter",
    },

    groupedList: {
      emptyMessage: "No transactions found.",

      months: {
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December",
      },
    },
  },

  analytics: {
    title: "Analytics",

    periods: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    },

    summary: {
      totalBalance: "Total Balance",
      totalExpense: "Total Expense",
    },

    progress: {
      spent: "%{percent}% of your income has been spent.",
    },

    labels: {
      income: "Income",
      expense: "Expense",
      transactionSingular: "transaction",
      transactionPlural: "transactions",
      contributionSingular: "contribution",
      contributionPlural: "contributions",
    },

    incomeExpenseChart: {
      title: "Income & Expenses",
      subtitle: "Income vs expenses",
    },

    expensesByCategory: {
      title: "Expenses by Category",
      subtitle: "Distribution by category",
      loadingTitle: "Loading expenses...",
      loadingText: "Getting your category totals for this period.",
      errorTitle: "Could not load categories",
      errorText: "Try changing the period or refreshing the screen.",
      emptyTitle: "No expenses yet",
      emptyText: "Add expense transactions to see this chart.",
      meta: "%{percent}% of expenses · %{count} %{transactionLabel}",
    },

    goalContributions: {
      title: "Goal Contributions",
      subtitle: "Contributions received by goal",
      loadingTitle: "Loading contributions...",
      loadingText: "Getting your goal contribution totals for this period.",
      errorTitle: "Could not load goals",
      errorText: "Try changing the period or refreshing the screen.",
      emptyTitle: "No contributions yet",
      emptyText: "Add goal contributions to see this chart.",
      amountContributed: "%{amount} contributed",
      meta: "%{percent}% of goal contributions · %{count} %{contributionLabel}",
    },

    months: {
      jan: "January",
      feb: "February",
      mar: "March",
      apr: "April",
      may: "May",
      jun: "June",
      jul: "July",
      aug: "August",
      sep: "September",
      oct: "October",
      nov: "November",
      dec: "December",
    },

    monthsShort: {
      jan: "Jan",
      feb: "Feb",
      mar: "Mar",
      apr: "Apr",
      may: "May",
      jun: "Jun",
      jul: "Jul",
      aug: "Aug",
      sep: "Sep",
      oct: "Oct",
      nov: "Nov",
      dec: "Dec",
    },
  },
};

export default en;