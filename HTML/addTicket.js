const form = document.querySelector('.form');
const resultMessage = document.getElementById('resultado1');
const backToTicketsButton = document.getElementById('backToTickets');

backToTicketsButton.addEventListener('click', () => {
	const query = new URLSearchParams(window.location.search);
	window.location.href = `listarTicket.html?${query.toString()}`;
});

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	resultMessage.textContent = '';

	const clienteID = new URLSearchParams(window.location.search).get('id');
	if (!clienteID) {
		resultMessage.style.color = 'RED';
		resultMessage.textContent =
			'No se encontró el identificador del cliente. Vuelva a ingresar desde su cuenta.';
		return;
	}

	const formData = new FormData(form);
	const descripcion = formData.get('descripcion')?.toString().trim();

	if (!descripcion) {
		resultMessage.style.color = 'RED';
		resultMessage.textContent = 'Ingrese la descripción del problema.';
		return;
	}

	try {
		const response = await fetch('http://localhost:8080/api/addTicket', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ clienteID, descripcion }),
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
				result.message || 'No se pudo crear el ticket.';
			return;
		}

		resultMessage.style.color = 'GREEN';
		resultMessage.textContent = `Ticket creado correctamente. Código: ${result.ticket.id}`;
		backToTicketsButton.hidden = false;
		form.reset();
	} catch (error) {
		console.error('Error al crear el ticket:', error);
		resultMessage.style.color = 'RED';
		resultMessage.textContent =
			error instanceof Error
				? error.message
				: 'No se pudo conectar con el servidor.';
	}
});