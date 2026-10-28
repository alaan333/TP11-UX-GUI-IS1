const form = document.querySelector('.form');
const resultMessage = document.getElementById('resultado1');

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	resultMessage.textContent = '';

	const formData = new FormData(form);
	const data = Object.fromEntries(formData); 

	const contacto = data.contacto?.toString().trim();
	const password = data.password1?.toString();
	const passwordConfirm = data.password2?.toString();
	const termsCondition = data.termscondition?.toString();
	
	if (!contacto || !password || !passwordConfirm) {
		resultMessage.style.color = 'GREEN';
		resultMessage.textContent = 'Complete todos los campos.';
		return;
	}

	if (password !== passwordConfirm) {
		resultMessage.style.color = 'RED';
		resultMessage.textContent = 'Las contraseñas no coinciden.';
		return;
	}
	if (termsCondition != 'on') {
		console.log('no aceptó los T&C no se puede loggear');
		document.getElementById('resultado2').style.textAlign = 'center';
		document.getElementById('resultado2').style.color = 'RED';
		document.getElementById('resultado2').textContent =
			'Debe aceptar los T&C para poder usar el sistema';
		return;
	}

	try {
		const response = await fetch('http://localhost:8080/api/resetCliente', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ contacto, password, passwordConfirm }),
		});

		let result;
		try {
			result = await response.json();
		} catch {
			throw new Error('El servidor devolvió una respuesta inválida.');
		}

		if (!response.ok || result.response !== 'OK') {
			resultMessage.style.color = 'RED';
			resultMessage.textContent =
				result.message || 'No se pudo actualizar la contraseña.';
			return;
		}

		resultMessage.style.color = 'GREEN';
		resultMessage.textContent = result.message;
		form.reset();
	} catch (error) {
		console.error('Error al actualizar la contraseña:', error);
		resultMessage.style.color = 'RED';
		resultMessage.textContent =
			error instanceof Error
				? error.message
				: 'No se pudo conectar con el servidor.';
	}
});
