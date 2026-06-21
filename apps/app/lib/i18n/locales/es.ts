const es = {
  common: {
    appName: "Welmio",
    loading: "Cargando...",
    retry: "Intentar de nuevo",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
  },

  auth: {
    loginTitle: "Bienvenido de nuevo",
    loginSubtitle: "Inicia sesión para continuar con Welmio",
    email: "Email",
    password: "Contraseña",
    signIn: "Iniciar sesión",
    forgotPassword: "¿Has olvidado tu contraseña?",
    invalidCredentials: "Email o contraseña incorrectos",

    login: {
      desktopTitle: "Finanzas inteligentes, vida sencilla",
      desktopSubtitle:
        "Controla tu dinero, organiza tus transacciones y mantén tus objetivos avanzando desde un panel limpio.",
      title: "Bienvenido de nuevo",
      subtitle: "Controla tu dinero, objetivos y hábitos en un solo lugar.",
      email: "Email",
      emailPlaceholder: "ejemplo@email.com",
      password: "Contraseña",
      passwordPlaceholder: "Tu contraseña",
      forgotPassword: "¿Has olvidado tu contraseña?",
      submit: "Iniciar sesión",
      loggingIn: "Iniciando sesión...",
      noAccount: "¿No tienes una cuenta?",
      signUp: "Regístrate",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      errors: {
        invalidCredentials: "Email o contraseña incorrectos",
      },
    },

    signup: {
      desktopHeadline: "Crea mejores hábitos financieros desde el primer día.",
      desktopCopy:
        "Crea tu cuenta de Welmio y empieza a organizar gastos, objetivos de ahorro y rutinas financieras desde un panel limpio.",
      title: "Crear cuenta",
      subtitle: "Empieza a controlar tu dinero, objetivos y hábitos en un solo lugar.",
      fullNameRequired: "Nombre completo *",
      fullNamePlaceholder: "Juan Pérez",
      emailRequired: "Email *",
      emailPlaceholder: "ejemplo@email.com",
      mobileNumber: "Número de móvil",
      mobileNumberPlaceholder: "+34 600 123 456",
      dateOfBirth: "Fecha de nacimiento",
      dateOfBirthPlaceholder: "DD / MM / AAAA",
      passwordRequired: "Contraseña *",
      passwordPlaceholder: "Tu contraseña",
      confirmPasswordRequired: "Confirmar contraseña *",
      confirmPasswordPlaceholder: "Repite tu contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      legal: {
        prefix: "Al continuar, aceptas los",
        terms: "Términos de uso",
        and: "y la",
        privacy: "Política de privacidad",
      },
      submit: "Registrarse",
      creatingAccount: "Creando cuenta...",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      logIn: "Iniciar sesión",
      errors: {
        requiredFields: "Completa los campos obligatorios antes de continuar",
        passwordsDontMatch: "Las contraseñas no coinciden",
      },
    },

    forgotPasswordScreen: {
      desktopTitle: "Restablece tu contraseña de forma segura",
      desktopText:
        "Te enviaremos un código de verificación seguro a tu email para que puedas crear una nueva contraseña.",
      title: "¿Has olvidado tu contraseña?",
      subtitle: "Introduce tu email y te enviaremos un código para restablecer tu contraseña.",
      email: "Email",
      emailPlaceholder: "ejemplo@email.com",
      sendingCode: "Enviando código...",
      nextStep: "Siguiente paso",
      backToLogin: "Volver a iniciar sesión",
      noAccount: "¿No tienes una cuenta?",
      signUp: "Regístrate",
      errors: {
        emailRequired: "El email es obligatorio",
      },
    },
		newPasswordScreen: {
			desktopTitle: "Establece una nueva contraseña",
			desktopText:
				"Elige una contraseña segura para proteger tu cuenta y mantener tu espacio financiero protegido.",
			title: "Nueva contraseña",
			subtitle: "Crea una nueva contraseña segura para recuperar el acceso a tu cuenta.",
			newPassword: "Nueva contraseña",
			newPasswordPlaceholder: "Tu nueva contraseña",
			confirmNewPassword: "Confirmar nueva contraseña",
			confirmNewPasswordPlaceholder: "Repite tu nueva contraseña",
			showPassword: "Mostrar contraseña",
			hidePassword: "Ocultar contraseña",
			updating: "Actualizando...",
			changePassword: "Cambiar contraseña",
			backToLogin: "Volver a iniciar sesión",
			noAccount: "¿No tienes una cuenta?",
			signUp: "Regístrate",
			errors: {
				missingEmailOrCode: "Falta el email o el código",
				passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
				passwordsDontMatch: "Las contraseñas no coinciden",
			},
		},
		verifyCodeScreen: {
			desktopTitle: "Confirma tu código de recuperación",
			desktopText:
				"Introduce el código de verificación de tu email para mantener seguro el restablecimiento de tu contraseña.",
			title: "Verificar código",
			subtitle: "Introduce el código de recuperación que te hemos enviado por email para continuar.",
			recoveryCode: "Código de recuperación",
			codePlaceholder: "Introduce tu código",
			checking: "Comprobando...",
			accept: "Aceptar",
			sending: "Enviando...",
			sendAgain: "Enviar de nuevo",
			backToLogin: "Volver a iniciar sesión",
			noAccount: "¿No tienes una cuenta?",
			signUp: "Regístrate",
			errors: {
				emailMissing: "Falta el email",
				codeRequired: "El código de recuperación es obligatorio",
			},
		},
		fingerprintScreen: {
			desktopTitle: "Acceso seguro con un solo toque",
			desktopSubtitle:
				"Mantén protegido tu panel financiero y accede de forma rápida y sencilla desde dispositivos de confianza.",
			title: "Usar Touch ID",
			subtitle:
				"Desbloquea Welmio más rápido y mantén tu cuenta protegida con acceso biométrico.",
			infoTitle: "Acceso seguro",
			infoText:
				"Tu huella permanece en este dispositivo y nunca se comparte con Welmio.",
			useTouchId: "Usar Touch ID",
			usePinInstead: "Usar código PIN",
		},
		successMessageScreen: {
			desktopHeadline: "Tu cuenta está segura",
			desktopText:
				"Tu contraseña se ha cambiado correctamente. Serás redirigido para iniciar sesión de nuevo con tus nuevas credenciales.",
			title: "Contraseña cambiada",
			subtitle: "Tu contraseña se ha actualizado correctamente",
		},
  },

  profile: {
    title: "Perfil",
    appVersion: "Versión de la app",
    logout: "Cerrar sesión",
  },

  goals: {
    title: "Objetivos",
    createGoal: "Crear objetivo",
    targetAmount: "Cantidad objetivo",
  },

  transactions: {
    title: "Transacciones",
    income: "Ingreso",
    expense: "Gasto",
  },
};

export default es;