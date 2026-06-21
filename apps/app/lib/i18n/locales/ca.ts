const ca = {
  common: {
    appName: "Welmio",
    loading: "Carregant...",
    retry: "Torna-ho a provar",
    cancel: "Cancel·lar",
    save: "Desar",
    delete: "Eliminar",
    edit: "Editar",
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
    income: "Ingrés",
    expense: "Despesa",
  },
};

export default ca;