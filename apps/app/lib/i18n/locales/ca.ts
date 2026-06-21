const ca = {
  common: {
    appName: "Welmio",
    loading: "Carregant...",
    retry: "Torna-ho a provar",
    cancel: "Cancel·lar",
    save: "Desar",
    delete: "Eliminar",
    edit: "Editar",
    weekDays: {
      mon: "Dl",
      tue: "Dt",
      wed: "Dc",
      thu: "Dj",
      fri: "Dv",
      sat: "Ds",
      sun: "Dg",
    },
  },

  auth: {
    loginTitle: "Benvingut de nou",
    loginSubtitle: "Inicia sessió per continuar amb Welmio",
    email: "Email",
    password: "Contrasenya",
    signIn: "Iniciar sessió",
    forgotPassword: "Has oblidat la contrasenya?",
    invalidCredentials: "Email o contrasenya incorrectes",

    login: {
      desktopTitle: "Finances intel·ligents, vida senzilla",
      desktopSubtitle:
        "Controla els teus diners, organitza les teves transaccions i mantén els teus objectius avançant des d’un panell net.",
      title: "Benvingut de nou",
      subtitle: "Controla els teus diners, objectius i hàbits en un sol lloc.",
      email: "Email",
      emailPlaceholder: "exemple@email.com",
      password: "Contrasenya",
      passwordPlaceholder: "La teva contrasenya",
      forgotPassword: "Has oblidat la contrasenya?",
      submit: "Iniciar sessió",
      loggingIn: "Iniciant sessió...",
      noAccount: "No tens cap compte?",
      signUp: "Registra’t",
      showPassword: "Mostra la contrasenya",
      hidePassword: "Oculta la contrasenya",
      errors: {
        invalidCredentials: "Email o contrasenya incorrectes",
      },
    },

    signup: {
      desktopHeadline: "Crea millors hàbits financers des del primer dia.",
      desktopCopy:
        "Crea el teu compte de Welmio i comença a organitzar despeses, objectius d’estalvi i rutines financeres des d’un panell net.",
      title: "Crear compte",
      subtitle: "Comença a controlar els teus diners, objectius i hàbits en un sol lloc.",
      fullNameRequired: "Nom complet *",
      fullNamePlaceholder: "Joan Pérez",
      emailRequired: "Email *",
      emailPlaceholder: "exemple@email.com",
      mobileNumber: "Número de mòbil",
      mobileNumberPlaceholder: "+34 600 123 456",
      dateOfBirth: "Data de naixement",
      dateOfBirthPlaceholder: "DD / MM / AAAA",
      passwordRequired: "Contrasenya *",
      passwordPlaceholder: "La teva contrasenya",
      confirmPasswordRequired: "Confirmar contrasenya *",
      confirmPasswordPlaceholder: "Repeteix la teva contrasenya",
      showPassword: "Mostra la contrasenya",
      hidePassword: "Oculta la contrasenya",
      legal: {
        prefix: "En continuar, acceptes els",
        terms: "Termes d’ús",
        and: "i la",
        privacy: "Política de privacitat",
      },
      submit: "Registrar-se",
      creatingAccount: "Creant compte...",
      alreadyHaveAccount: "Ja tens un compte?",
      logIn: "Iniciar sessió",
      errors: {
        requiredFields: "Completa els camps obligatoris abans de continuar",
        passwordsDontMatch: "Les contrasenyes no coincideixen",
      },
    },

    forgotPasswordScreen: {
      desktopTitle: "Restableix la teva contrasenya de forma segura",
      desktopText:
        "T’enviarem un codi de verificació segur al teu email perquè puguis crear una nova contrasenya.",
      title: "Has oblidat la contrasenya?",
      subtitle: "Introdueix el teu email i t’enviarem un codi per restablir la contrasenya.",
      email: "Email",
      emailPlaceholder: "exemple@email.com",
      sendingCode: "Enviant codi...",
      nextStep: "Següent pas",
      backToLogin: "Tornar a iniciar sessió",
      noAccount: "No tens cap compte?",
      signUp: "Registra’t",
      errors: {
        emailRequired: "L’email és obligatori",
      },
    },
    newPasswordScreen: {
      desktopTitle: "Estableix una nova contrasenya",
      desktopText:
        "Tria una contrasenya segura per protegir el teu compte i mantenir el teu espai financer protegit.",
      title: "Nova contrasenya",
      subtitle: "Crea una nova contrasenya segura per recuperar l’accés al teu compte.",
      newPassword: "Nova contrasenya",
      newPasswordPlaceholder: "La teva nova contrasenya",
      confirmNewPassword: "Confirmar nova contrasenya",
      confirmNewPasswordPlaceholder: "Repeteix la teva nova contrasenya",
      showPassword: "Mostra la contrasenya",
      hidePassword: "Oculta la contrasenya",
      updating: "Actualitzant...",
      changePassword: "Canviar contrasenya",
      backToLogin: "Tornar a iniciar sessió",
      noAccount: "No tens cap compte?",
      signUp: "Registra’t",
      errors: {
        missingEmailOrCode: "Falta l’email o el codi",
        passwordTooShort: "La contrasenya ha de tenir almenys 6 caràcters",
        passwordsDontMatch: "Les contrasenyes no coincideixen",
      },
    },
    verifyCodeScreen: {
      desktopTitle: "Confirma el teu codi de recuperació",
      desktopText:
        "Introdueix el codi de verificació del teu email per mantenir segur el restabliment de la contrasenya.",
      title: "Verificar codi",
      subtitle: "Introdueix el codi de recuperació que t’hem enviat per email per continuar.",
      recoveryCode: "Codi de recuperació",
      codePlaceholder: "Introdueix el teu codi",
      checking: "Comprovant...",
      accept: "Acceptar",
      sending: "Enviant...",
      sendAgain: "Enviar de nou",
      backToLogin: "Tornar a iniciar sessió",
      noAccount: "No tens cap compte?",
      signUp: "Registra’t",
      errors: {
        emailMissing: "Falta l’email",
        codeRequired: "El codi de recuperació és obligatori",
      },
    },
    fingerprintScreen: {
      desktopTitle: "Accés segur amb un sol toc",
      desktopSubtitle:
        "Mantén protegit el teu panell financer i accedeix de manera ràpida i senzilla des de dispositius de confiança.",
      title: "Utilitzar Touch ID",
      subtitle:
        "Desbloqueja Welmio més ràpidament i mantén el teu compte protegit amb accés biomètric.",
      infoTitle: "Accés segur",
      infoText:
        "La teva empremta es queda en aquest dispositiu i mai es comparteix amb Welmio.",
      useTouchId: "Utilitzar Touch ID",
      usePinInstead: "Utilitzar codi PIN",
    },
    successMessageScreen: {
      desktopHeadline: "El teu compte està segur",
      desktopText:
        "La teva contrasenya s’ha canviat correctament. Seràs redirigit per iniciar sessió de nou amb les teves noves credencials.",
      title: "Contrasenya canviada",
      subtitle: "La teva contrasenya s’ha actualitzat correctament",
    },
  },

  home: {
    greeting: "Hola, %{name}",
    defaultUser: "Usuari",

    greetings: {
      morning: "Bon dia",
      afternoon: "Bona tarda",
      evening: "Bona nit",
    },

    sections: {
      overview: "Resum",
      goals: "Objectius",
      analytics: "Analítiques",
      recentTransactions: "Transaccions recents",
    },

    actions: {
      viewAll: "Veure-ho tot",
    },

    overview: {
      totalBalance: "Balanç total",
      totalExpense: "Despesa total",
    },

    analytics: {
      thisWeekChart: "Gràfic d’aquesta setmana",
      weekly: "Setmanal",
    },

    transactions: {
      empty: "Encara no hi ha transaccions recents.",
    },

    errors: {
      loadGoals: "No s’han pogut carregar els objectius.",
    },
  },

  profile: {
    title: "Perfil",
    appVersion: "Versió de l’app",
    logout: "Tancar sessió",
  },

  goals: {
    title: "Objectius",
    createGoal: "Crear objectiu",
    targetAmount: "Quantitat objectiu",
  },

  transactions: {
    title: "Transaccions",
    income: "Ingressos",
    expense: "Despeses",
    totalBalance: "Saldo total",

    feedback: {
      deleteSuccess: "Transacció eliminada correctament",
      deleteError: "Error en eliminar la transacció",
    },

    types: {
      income: "Ingressos",
      expense: "Despeses",
    },

    details: {
      title: "Detalls de la transacció",
      category: "Categoria",
      account: "Compte",
      currency: "Divisa",
      nature: "Naturalesa",
      frequency: "Freqüència",
      date: "Data",
      notes: "Notes",
      notSet: "Sense assignar",
      noNotesAdded: "No s’han afegit notes.",
      edit: "Editar",
      delete: "Eliminar",

      deleteDialog: {
        title: "Eliminar transacció",
        message:
          "Segur que vols eliminar aquesta transacció?\nAquesta acció no es pot desfer.",
        confirmLabel: "Sí, eliminar",
        cancelLabel: "Cancel·lar",
        loadingLabel: "Eliminant...",
      },
    },

    form: {
      newTitle: "Nova transacció",
      editTitle: "Editar transacció",
      type: "Tipus",
      incomeContribution: "Aportació d’ingrés",
      date: "Data",
      datePlaceholder: "DD / MM / AAAA",
      amount: "Quantitat",
      amountPlaceholder: "30,00",
      description: "Descripció",
      descriptionPlaceholder: "Cinema",
      category: "Categoria",
      account: "Compte",
      nature: "Naturalesa",
      frequency: "Freqüència",
      notes: "Notes",
      notesPlaceholder: "Escriu una nota",
      cancel: "Cancel·lar",
      save: "Desar",
      saving: "Desant...",
      update: "Actualitzar",
      updating: "Actualitzant...",

      natureOptions: {
        fixed: "Fixa",
        variable: "Variable",
        essential: "Essencial",
        non_essential: "No essencial",
        need: "Necessitat",
        want: "Desig",
        saving: "Estalvi",
        investment: "Inversió",
      },

      frequencyOptions: {
        one_time: "Única",
        recurring: "Recurrent",
        daily: "Diària",
        weekly: "Setmanal",
        monthly: "Mensual",
        yearly: "Anual",
      },

      accountTypes: {
        cash: "Efectiu",
        bank: "Banc",
        debit: "Dèbit",
        credit: "Crèdit",
        savings: "Estalvis",
        investment: "Inversió",
        wallet: "Cartera",
      },
    },

    categoryFilter: {
      title: "Filtrar per categoria",
      addMoreCategories: "Afegir més categories",
      clear: "Netejar",
      applyFilter: "Aplicar filtre",
      editCategory: "Editar categoria",
      newCategory: "Nova categoria",
      categoryNamePlaceholder: "Nom de la categoria",
      type: "Tipus",
      icon: "Icona",
      cancel: "Cancel·lar",
      save: "Desar",
      saving: "Desant...",
      saveChanges: "Desar canvis",

      deleteDialog: {
        title: "Eliminar categoria",
        singleMessage:
          "Segur que vols eliminar aquesta categoria?\nAquesta acció no es pot desfer.",
        multipleMessage:
          "Segur que vols eliminar aquestes categories?\nAquesta acció no es pot desfer.",
        singleConfirmLabel: "Sí, eliminar",
        multipleConfirmLabel: "Sí, eliminar-les totes",
        cancelLabel: "Cancel·lar",
        loadingLabel: "Eliminant...",
      },
    },

    calendarFilter: {
      title: "Filtrar per data",
      clear: "Netejar",
      applyFilter: "Aplicar filtre",
    },
  },

  groupedList: {
    emptyMessage: "No s’han trobat transaccions.",

    months: {
      january: "Gener",
      february: "Febrer",
      march: "Març",
      april: "Abril",
      may: "Maig",
      june: "Juny",
      july: "Juliol",
      august: "Agost",
      september: "Setembre",
      october: "Octubre",
      november: "Novembre",
      december: "Desembre",
    },
  },

  analytics: {
    title: "Analítiques",

    periods: {
      daily: "Diari",
      weekly: "Setmanal",
      monthly: "Mensual",
      yearly: "Anual",
    },

    summary: {
      totalBalance: "Saldo total",
      totalExpense: "Despesa total",
    },

    progress: {
      spent: "Has gastat el %{percent}% dels teus ingressos.",
    },

    labels: {
      income: "Ingressos",
      expense: "Despeses",
      transactionSingular: "transacció",
      transactionPlural: "transaccions",
      contributionSingular: "aportació",
      contributionPlural: "aportacions",
    },

    incomeExpenseChart: {
      title: "Ingressos i despeses",
      subtitle: "Ingressos davant despeses",
    },

    expensesByCategory: {
      title: "Despeses per categoria",
      subtitle: "Distribució per categoria",
      loadingTitle: "Carregant despeses...",
      loadingText: "Obtenint els totals per categoria per a aquest període.",
      errorTitle: "No s’han pogut carregar les categories",
      errorText: "Prova de canviar el període o refrescar la pantalla.",
      emptyTitle: "Encara no hi ha despeses",
      emptyText: "Afegeix transaccions de despesa per veure aquest gràfic.",
      meta: "%{percent}% de les despeses · %{count} %{transactionLabel}",
    },

    goalContributions: {
      title: "Aportacions a objectius",
      subtitle: "Aportacions rebudes per objectiu",
      loadingTitle: "Carregant aportacions...",
      loadingText: "Obtenint els totals d’aportacions per a aquest període.",
      errorTitle: "No s’han pogut carregar els objectius",
      errorText: "Prova de canviar el període o refrescar la pantalla.",
      emptyTitle: "Encara no hi ha aportacions",
      emptyText: "Afegeix aportacions a objectius per veure aquest gràfic.",
      amountContributed: "%{amount} aportats",
      meta: "%{percent}% de les aportacions a objectius · %{count} %{contributionLabel}",
    },

    months: {
      jan: "Gener",
      feb: "Febrer",
      mar: "Març",
      apr: "Abril",
      may: "Maig",
      jun: "Juny",
      jul: "Juliol",
      aug: "Agost",
      sep: "Setembre",
      oct: "Octubre",
      nov: "Novembre",
      dec: "Desembre",
    },

    monthsShort: {
      jan: "Gen",
      feb: "Feb",
      mar: "Març",
      apr: "Abr",
      may: "Maig",
      jun: "Juny",
      jul: "Jul",
      aug: "Ago",
      sep: "Set",
      oct: "Oct",
      nov: "Nov",
      dec: "Des",
    },
  },
};

export default ca;