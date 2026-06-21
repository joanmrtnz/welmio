const es = {
  common: {
    appName: "Welmio",
    loading: "Cargando...",
    retry: "Intentar de nuevo",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    weekDays: {
      mon: "Lu",
      tue: "Ma",
      wed: "Mi",
      thu: "Ju",
      fri: "Vi",
      sat: "Sá",
      sun: "Do",
    },
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

  home: {
    greeting: "Hola, %{name}",
    defaultUser: "Usuario",

    greetings: {
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches",
    },

    sections: {
      overview: "Resumen",
      goals: "Objetivos",
      analytics: "Analíticas",
      recentTransactions: "Transacciones recientes",
    },

    actions: {
      viewAll: "Ver todo",
    },

    overview: {
      totalBalance: "Balance total",
      totalExpense: "Gasto total",
    },

    analytics: {
      thisWeekChart: "Gráfico de esta semana",
      weekly: "Semanal",
    },

    transactions: {
      empty: "Todavía no hay transacciones recientes.",
    },

    errors: {
      loadGoals: "No se pudieron cargar los objetivos.",
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

    summary: {
      totalSaved: "Total ahorrado",
      targetAmount: "Cantidad objetivo",
    },

    progress: {
      loading: "Cargando objetivos...",
      empty: "Todavía no hay objetivos.",
      saved: "Has ahorrado el %{percent}% de tu objetivo total.",
    },

    mainGoal: {
      eyebrow: "Objetivo principal",
      savedOf: "ahorrado de %{amount}",
      targetDate: "Fecha objetivo · %{date}",
    },

    empty: {
      title: "Todavía no hay objetivos",
      description: "Crea tu primer objetivo para empezar a seguir tu progreso.",
    },

    pace: {
      monthlyNeeded: "Necesario al mes",
      activeGoals: "Objetivos activos",
    },

    list: {
      title: "Mis objetivos",
      savedAmount: "%{amount} ahorrados",
    },

    filters: {
      active: "Activo",
    },

    actions: {
      newGoal: "Nuevo objetivo",
    },

    smartTip: {
      title: "Consejo inteligente",
      withMainGoal:
        "Necesitas alrededor de %{amount} al mes para alcanzar tu objetivo de %{goalName} a tiempo.",
      empty: "Crea un objetivo para recibir consejos simples de progreso.",
    },

    statusLabels: {
      active: "Activo",
      completed: "Completado",
      paused: "Pausado",
      archived: "Archivado",
      overdue: "Atrasado",
      in_progress: "En progreso",
    },

    contributions: {
      defaultDescription: "Aportación a %{goalName}",
      defaultNotes: "Aportación a objetivo · %{goalName}",
    },

    feedback: {
      createSuccess: "Objetivo creado correctamente.",
      createError: "No se pudo crear el objetivo.",
      updateSuccess: "Objetivo actualizado correctamente.",
      updateError: "No se pudo actualizar el objetivo.",
      deleteSuccess: "Objetivo eliminado correctamente.",
      deleteError: "No se pudo eliminar el objetivo.",
      loadError: "No se pudieron cargar los objetivos.",
      contributionDeleteSuccess: "Aportación eliminada correctamente.",
      contributionDeleteError: "No se pudo eliminar la aportación.",
    },

    details: {
      title: "Detalles del objetivo",
      noDeadline: "Sin fecha límite",
      completed: "completado",
      saved: "Ahorrado",
      target: "Objetivo",
      remaining: "Restante",
      monthlyNeeded: "Necesario al mes",
      progressInsight: "Análisis del progreso",
      progressInsightText:
        "Has ahorrado %{saved} de %{target}. Para alcanzar este objetivo a tiempo, necesitas alrededor de %{monthlyNeeded} al mes.",
      contributionSingular: "aportación",
      contributionPlural: "aportaciones",
      editGoal: "Editar objetivo",
      delete: "Eliminar",

      goalTypes: {
        emergency_fund: "Fondo de emergencia",
        savings: "Ahorro",
        purchase: "Compra",
        trip: "Viaje",
        investment: "Inversión",
        debt_payment: "Pago de deuda",
        education: "Educación",
        home: "Vivienda",
        car: "Coche",
        other: "Otro",
      },

      contributions: {
        title: "Aportaciones recientes",
        subtitle: "Último dinero añadido a este objetivo",
        loading: "Cargando aportaciones...",
        loadError: "No se pudieron cargar las aportaciones.",
        empty:
          "Todavía no hay aportaciones. Añade la primera para empezar a seguir este objetivo.",
        defaultTitle: "Aportación al objetivo",
      },

      deleteDialog: {
        title: "Eliminar objetivo",
        message:
          "¿Seguro que quieres eliminar este objetivo?\nEsta acción no se puede deshacer.",
        messageWithContributions:
          "¿Seguro que quieres eliminar este objetivo?\nEsto también eliminará %{count} %{contributionLabel} vinculadas a este objetivo.\nEsta acción no se puede deshacer.",
        confirmLabel: "Sí, eliminar",
        cancelLabel: "Cancelar",
        loadingLabel: "Eliminando...",
      },

      deleteContributionDialog: {
        title: "Eliminar aportación",
        message:
          "¿Seguro que quieres eliminar esta aportación?\nSe eliminará del progreso del objetivo, pero no se eliminará la transacción vinculada.",
        confirmLabel: "Sí, eliminar",
        cancelLabel: "Cancelar",
        loadingLabel: "Eliminando...",
      },
    },

    createModal: {
      createTitle: "Crear objetivo",
      editTitle: "Editar objetivo",

      preview: {
        new: "Nuevo objetivo",
        editing: "Editando objetivo",
        target: "Objetivo · %{amount}",
        defaultTargetAmount: "30.000 €",
      },

      fields: {
        goalName: "Nombre del objetivo",
        targetAmount: "Cantidad objetivo",
        currentSaved: "Ahorro actual",
        targetDate: "Fecha objetivo",
        goalType: "Tipo de objetivo",
        icon: "Icono",
      },

      placeholders: {
        name: "Entrada de una casa",
        targetAmount: "30000",
        currentSaved: "9000",
        targetDate: "2027-12-31",
      },

      actions: {
        createGoal: "Crear objetivo",
        creating: "Creando...",
        saveChanges: "Guardar cambios",
        saving: "Guardando...",
      },

      errors: {
        nameRequired: "El nombre del objetivo es obligatorio.",
        targetAmountInvalid: "La cantidad objetivo debe ser mayor que 0.",
        currentAmountInvalid: "El ahorro actual debe ser 0 o mayor.",
        currentGreaterThanTarget:
          "El ahorro actual no puede ser mayor que la cantidad objetivo.",
      },
    },

    quickGoals: {
      savedOf: "%{saved} de %{target}",
      emptyTitle: "Todavía no hay objetivos",
      emptyDescription: "Crea tu primer objetivo para empezar a seguir el progreso.",
    },
  },

  transactions: {
    title: "Transacciones",
    income: "Ingresos",
    expense: "Gastos",
    totalBalance: "Saldo total",

    feedback: {
      deleteSuccess: "Transacción eliminada correctamente",
      deleteError: "Error al eliminar la transacción",
    },

    types: {
      income: "Ingresos",
      expense: "Gastos",
    },

    details: {
      title: "Detalles de la transacción",
      category: "Categoría",
      account: "Cuenta",
      currency: "Divisa",
      nature: "Naturaleza",
      frequency: "Frecuencia",
      date: "Fecha",
      notes: "Notas",
      notSet: "Sin asignar",
      noNotesAdded: "No se han añadido notas.",
      edit: "Editar",
      delete: "Eliminar",

      deleteDialog: {
        title: "Eliminar transacción",
        message:
          "¿Seguro que quieres eliminar esta transacción?\nEsta acción no se puede deshacer.",
        confirmLabel: "Sí, eliminar",
        cancelLabel: "Cancelar",
        loadingLabel: "Eliminando...",
      },
    },

    form: {
      newTitle: "Nueva transacción",
      editTitle: "Editar transacción",
      type: "Tipo",
      incomeContribution: "Aportación de ingreso",
      date: "Fecha",
      datePlaceholder: "DD / MM / AAAA",
      amount: "Cantidad",
      amountPlaceholder: "30,00",
      description: "Descripción",
      descriptionPlaceholder: "Cine",
      category: "Categoría",
      account: "Cuenta",
      nature: "Naturaleza",
      frequency: "Frecuencia",
      notes: "Notas",
      notesPlaceholder: "Escribe una nota",
      cancel: "Cancelar",
      save: "Guardar",
      saving: "Guardando...",
      update: "Actualizar",
      updating: "Actualizando...",

      natureOptions: {
        fixed: "Fija",
        variable: "Variable",
        essential: "Esencial",
        non_essential: "No esencial",
        need: "Necesidad",
        want: "Deseo",
        saving: "Ahorro",
        investment: "Inversión",
      },

      frequencyOptions: {
        one_time: "Única",
        recurring: "Recurrente",
        daily: "Diaria",
        weekly: "Semanal",
        monthly: "Mensual",
        yearly: "Anual",
      },

      accountTypes: {
        cash: "Efectivo",
        bank: "Banco",
        debit: "Débito",
        credit: "Crédito",
        savings: "Ahorros",
        investment: "Inversión",
        wallet: "Cartera",
      },
    },

    categoryFilter: {
      title: "Filtrar por categoría",
      addMoreCategories: "Añadir más categorías",
      clear: "Limpiar",
      applyFilter: "Aplicar filtro",
      editCategory: "Editar categoría",
      newCategory: "Nueva categoría",
      categoryNamePlaceholder: "Nombre de la categoría",
      type: "Tipo",
      icon: "Icono",
      cancel: "Cancelar",
      save: "Guardar",
      saving: "Guardando...",
      saveChanges: "Guardar cambios",

      deleteDialog: {
        title: "Eliminar categoría",
        singleMessage:
          "¿Seguro que quieres eliminar esta categoría?\nEsta acción no se puede deshacer.",
        multipleMessage:
          "¿Seguro que quieres eliminar estas categorías?\nEsta acción no se puede deshacer.",
        singleConfirmLabel: "Sí, eliminar",
        multipleConfirmLabel: "Sí, eliminar todas",
        cancelLabel: "Cancelar",
        loadingLabel: "Eliminando...",
      },
    },

    calendarFilter: {
      title: "Filtrar por fecha",
      clear: "Limpiar",
      applyFilter: "Aplicar filtro",
    },

    groupedList: {
      emptyMessage: "No se encontraron transacciones.",

      months: {
        january: "Enero",
        february: "Febrero",
        march: "Marzo",
        april: "Abril",
        may: "Mayo",
        june: "Junio",
        july: "Julio",
        august: "Agosto",
        september: "Septiembre",
        october: "Octubre",
        november: "Noviembre",
        december: "Diciembre",
      },
    },
  },

  analytics: {
    title: "Analíticas",

    periods: {
      daily: "Diario",
      weekly: "Semanal",
      monthly: "Mensual",
      yearly: "Anual",
    },

    summary: {
      totalBalance: "Saldo total",
      totalExpense: "Gasto total",
    },

    progress: {
      spent: "Has gastado el %{percent}% de tus ingresos.",
    },

    labels: {
      income: "Ingresos",
      expense: "Gastos",
      transactionSingular: "transacción",
      transactionPlural: "transacciones",
      contributionSingular: "aportación",
      contributionPlural: "aportaciones",
    },

    incomeExpenseChart: {
      title: "Ingresos y gastos",
      subtitle: "Ingresos frente a gastos",
    },

    expensesByCategory: {
      title: "Gastos por categoría",
      subtitle: "Distribución por categoría",
      loadingTitle: "Cargando gastos...",
      loadingText: "Obteniendo los totales por categoría para este periodo.",
      errorTitle: "No se pudieron cargar las categorías",
      errorText: "Prueba a cambiar el periodo o refrescar la pantalla.",
      emptyTitle: "Todavía no hay gastos",
      emptyText: "Añade transacciones de gasto para ver este gráfico.",
      meta: "%{percent}% de los gastos · %{count} %{transactionLabel}",
    },

    goalContributions: {
      title: "Aportaciones a objetivos",
      subtitle: "Aportaciones recibidas por objetivo",
      loadingTitle: "Cargando aportaciones...",
      loadingText: "Obteniendo los totales de aportaciones para este periodo.",
      errorTitle: "No se pudieron cargar los objetivos",
      errorText: "Prueba a cambiar el periodo o refrescar la pantalla.",
      emptyTitle: "Todavía no hay aportaciones",
      emptyText: "Añade aportaciones a objetivos para ver este gráfico.",
      amountContributed: "%{amount} aportados",
      meta: "%{percent}% de las aportaciones a objetivos · %{count} %{contributionLabel}",
    },

    months: {
      jan: "Enero",
      feb: "Febrero",
      mar: "Marzo",
      apr: "Abril",
      may: "Mayo",
      jun: "Junio",
      jul: "Julio",
      aug: "Agosto",
      sep: "Septiembre",
      oct: "Octubre",
      nov: "Noviembre",
      dec: "Diciembre",
    },

    monthsShort: {
      jan: "Ene",
      feb: "Feb",
      mar: "Mar",
      apr: "Abr",
      may: "May",
      jun: "Jun",
      jul: "Jul",
      aug: "Ago",
      sep: "Sep",
      oct: "Oct",
      nov: "Nov",
      dec: "Dic",
    },
  },
};

export default es;