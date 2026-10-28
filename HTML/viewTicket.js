const params = new URLSearchParams(window.location.search);
const ticketId = params.get('ticketId');
const ticketDetails = document.getElementById('ticketDetails');
const message = document.getElementById('mensajes');
const backLink = document.getElementById('backToTickets');

const listParams = new URLSearchParams(params);
console.log('Parametros '+listParams.toString());
listParams.delete('ticketId');
console.log('Parametros '+listParams.toString());
backLink.href = `listarTicket.html?${listParams.toString()}`;

function showMessage(text, color = 'RED') {
	message.style.color = color;
	message.textContent = text;
}

if (!ticketId) {
	showMessage('No se indicó el ID del ticket.');
} else {
	fetch('http://localhost:8080/api/getTicket', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: ticketId }),
	})
		.then(async (response) => {
			let result;
			try {
				result = await response.json();
			} catch {
				throw new Error('El servidor devolvió una respuesta inválida.');
			}

			if (!response.ok || result.response !== 'OK') {
				throw new Error(result.message || 'No se pudo encontrar el ticket.');
			}

			return result;
		})
		.then((result) => {
			const ticket = result.data?.Item || result.data;
			if (!ticket || ticket.id !== ticketId) {
				throw new Error('La respuesta no contiene el ticket solicitado.');
			}
			if (ticket.solucion === undefined || ticket.solucion === null) {
				ticket.solucion = 'No se ha proporcionado una solución.';
			}
			const fields = [
				['ID del ticket', ticket.id],
				['Cliente', ticket.clienteID],
				['Descripción', ticket.descripcion],
				['Estado', ticket.estado_solucion],
				['Fecha de apertura', ticket.fecha_apertura],
				['Último contacto', ticket.ultimo_contacto],
				['Solución', ticket.solucion],
			];
			console.log('Ticket details:', fields);
			const table = document.createElement('table');
			table.style.borderCollapse = 'collapse';
			table.style.margin = '16px auto';

			fields.forEach(([label, value]) => {
				if (value === undefined || value === null || value === '') {
					return;
				}

				const row = table.insertRow(); //crea la fila.
				const header = document.createElement('th'); //crea la celda del encabezado.
				header.textContent = label;
				const cell = document.createElement('td'); //crea la celda del valor.
				cell.textContent = String(value); //establece el texto de cada celda.
				[header, cell].forEach((element) => { //crea un arreglo con las dos celdas.
					element.style.border = '1px solid #777';
					element.style.padding = '8px';
					row.appendChild(element); //incorpora el elemento a la fila.
				});
			});

			ticketDetails.appendChild(table);
		})
		.catch((error) => {
			console.error('Error al consultar el ticket:', error);
			showMessage(error instanceof Error ? error.message : 'No se pudo cargar el ticket.');
		});
}
