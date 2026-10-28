const form = document.querySelector('.form');
const resultMessage = document.getElementById('resultado1');
const termsMessage = document.getElementById('resultado2');

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const formData = new FormData(form);
	const data = Object.fromEntries(formData);
	const contacto = data.contacto?.trim();
	const nombre = `${data.name?.trim() || ''} ${data.surname?.trim() || ''}`.trim();
	const password = data.password1?.toString();
	const passwordConfirm = data.password2?.toString();

	resultMessage.textContent = '';
	termsMessage.textContent = '';

	if (
		!contacto ||
		!password ||
		!passwordConfirm ||
		!data.name?.trim() ||
		!data.surname?.trim()
	) {
		resultMessage.style.color = 'RED';
		resultMessage.style.textAlign = 'center';
		resultMessage.textContent = 'Complete todos los campos para poder registrarse';
		return;
	}

	if (password !== passwordConfirm) {
		resultMessage.style.color = 'RED';
		resultMessage.style.textAlign = 'center';
		resultMessage.textContent = 'Las contraseñas no coinciden.';
		return;
	}

	if (data.termscondition !== 'on') {
		termsMessage.style.textAlign = 'center';
		termsMessage.style.color = 'RED';
		termsMessage.textContent = 'Debe aceptar los T&C para poder registrarse';
		return;
	}

	try {
		const response = await fetch('http://localhost:8080/api/addCliente', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ contacto, nombre, password }),
		});

		let result;
		try {
			result = await response.json();
		} catch {
			throw new Error('El servidor devolvió una respuesta inválida.');
		}

		if (!response.ok || result.response !== 'OK') {
			resultMessage.style.color = 'RED';
			resultMessage.style.textAlign = 'center';
			resultMessage.textContent =
				result.message || 'No se pudo completar el registro';
			return;
		}

		resultMessage.style.color = 'GREEN';
		resultMessage.style.textAlign = 'center';
		resultMessage.textContent =
			'Registro exitoso. Ya puede iniciar sesión.';
		form.reset();
	} catch (error) {
		console.error('Error al registrar el cliente:', error);
		resultMessage.style.color = 'RED';
		resultMessage.style.textAlign = 'center';
		resultMessage.textContent =
			error instanceof Error
				? error.message
				: 'No se pudo conectar con el servidor de registro.';
	}
});
