// funciones operaciones y balance

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const btnNuevaOperacion = document.getElementById('show-operation');
  const sectionOperation = document.getElementById('section-operation');
  const btnCancelarAgregarOperacion = document.getElementById('cancelar-agregar-operaciones-boton');
  const btnAgregarOperacion = document.getElementById('agregar-operaciones-boton');
  const operationsTableBody = document.getElementById('operations-table-body');
  const noOperationsDiv = document.getElementById('no-operations');
  const addOperationsDiv = document.getElementById('add-operations');
  const editOperationSection = document.getElementById('edit-operation');
  const mainContent = document.getElementById('main-content');

  // Elementos para el balance
  const gananciasElement = document.getElementById('ganancias');
  const gastosElement = document.getElementById('gastos');
  const balanceTotalElement = document.getElementById('balance-total');

  let operacionIdToDelete;
  let operaciones = [];
  let operacionIdEdit;

  btnNuevaOperacion.addEventListener('click', () => {
    sectionOperation.classList.remove('hidden'); 
    mainContent.classList.add('hidden'); // Ocultar el contenido principal
    editOperationSection.classList.add('hidden'); 
  });
  
  btnCancelarAgregarOperacion.addEventListener('click', () => {
    sectionOperation.classList.add('hidden');  
    mainContent.classList.remove('hidden');  
  
  });
  +
  btnAgregarOperacion.addEventListener('click', () => {
    sectionOperation.classList.add('hidden');  // Ocultar después de agregar operación
    mainContent.classList.remove('hidden');  // Mostrar contenido principal
  });


  btnAgregarOperacion.addEventListener('click', (e) => {
    e.preventDefault();
    const descripcion = document.getElementById('description-input').value;
    const monto = parseFloat(document.getElementById('monto-input').value); // Convertir a número
    const tipoOperacion = document.getElementById('tipo-operacion').value;
    const categoria = document.getElementById('categories-select').value;
    const fecha = document.getElementById('date-input').value;

    const nuevaOperacion = {
      id: Date.now(),
      descripcion,
      monto,
      tipoOperacion,
      categoria,
      fecha,
    };

    operaciones.push(nuevaOperacion);
    actualizarTablaOperaciones();
    limpiarFormulario();
    sectionOperation.classList.add('hidden');

    // Actualizar el balance
    actualizarBalance();
  });

  function actualizarBalance() {
    let totalGanancias = 0;
    let totalGastos = 0;

    operaciones.forEach(op => {
      if (op.tipoOperacion === 'ganancia') {
        totalGanancias += op.monto;
      } else {
        totalGastos += op.monto;
      }
    });

    const totalBalance = totalGanancias - totalGastos;

    gananciasElement.textContent = totalGanancias.toFixed(2); // Mostrar con dos decimales
    gastosElement.textContent = totalGastos.toFixed(2); // Mostrar con dos decimales
    balanceTotalElement.textContent = totalBalance.toFixed(2); // Mostrar con dos decimales
  }

  function limpiarFormulario() {
    document.getElementById('description-input').value = '';
    document.getElementById('monto-input').value = '0';
    document.getElementById('tipo-operacion').value = 'gasto';
    document.getElementById('categories-select').value = 'comida';
    document.getElementById('date-input').value = '';
  }

  function actualizarTablaOperaciones() {
    operationsTableBody.innerHTML = ''; // Limpiar la tabla primero

    if (operaciones.length === 0) {
        noOperationsDiv.classList.remove('hidden');
        addOperationsDiv.classList.add('hidden');
    } else {
        noOperationsDiv.classList.add('hidden');
        addOperationsDiv.classList.remove('hidden');

        operaciones.forEach((operacion) => {
            const tr = document.createElement('tr'); // Crear una nueva fila
            tr.innerHTML = `
              <td >${operacion.descripcion}</td>  <!-- Descripción -->
              <td>${operacion.monto.toFixed(2)}</td>  <!-- Monto -->
              <td>${operacion.categoria}</td>  <!-- Categoría -->
              <td>${operacion.fecha}</td>  <!-- Fecha -->
              <td>
                  <button class="bg-yellow-500 text-white px-2 py-1 rounded edit-btn" data-id="${operacion.id}">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button class="bg-red-500 text-white px-2 py-1 rounded delete-btn" data-id="${operacion.id}">
                      <i class="fas fa-trash"></i>
                  </button>
              </td>
            `;
            operationsTableBody.appendChild(tr); // Agregar la fila al cuerpo de la tabla
        });

        // Asignar eventos a los botones de eliminar y editar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', mostrarModalEliminar);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', editarOperacion);
        });
    }
}


  function mostrarModalEliminar(event) {
    operacionIdToDelete = Number(event.target.closest('button').dataset.id);
    document.getElementById('delete-modal').classList.remove('hidden');
  }

  document.getElementById('cancel-delete-button').addEventListener('click', () => {
    document.getElementById('delete-modal').classList.add('hidden');
  });

  document.getElementById('confirm-delete-button').addEventListener('click', () => {
    borrarOperacion(operacionIdToDelete);
    document.getElementById('delete-modal').classList.add('hidden');
  });

  function borrarOperacion(id) {
    operaciones = operaciones.filter(operacion => operacion.id !== id);
    actualizarTablaOperaciones();
    actualizarBalance(); // Actualizar balance después de borrar
  }

  function editarOperacion(event) {
    operacionIdEdit = Number(event.target.getAttribute('data-id'));
    const operacion = operaciones.find(op => op.id === operacionIdEdit);

    if (!operacion) {
      console.error(`Operación con ID ${operacionIdEdit} no encontrada`);
      return;
    }

    document.getElementById('edit-description-operation').value = operacion.descripcion;
    document.getElementById('edit-operation-amount').value = operacion.monto;
    document.getElementById('edit-type-operation').value = operacion.tipoOperacion;
    document.getElementById('edit-category-operation').value = operacion.categoria;
    document.getElementById('edit-date-operation').value = operacion.fecha;

    sectionOperation.classList.add('hidden');
    editOperationSection.classList.remove('hidden');
  }

  document.querySelector('.save-edit-operation').addEventListener('click', (e) => {
    e.preventDefault();
    
    const descripcion = document.getElementById('edit-description-operation').value;
    const monto = parseFloat(document.getElementById('edit-operation-amount').value);
    const tipoOperacion = document.getElementById('edit-type-operation').value;
    const categoria = document.getElementById('edit-category-operation').value;
    const fecha = document.getElementById('edit-date-operation').value;

    const operacionEditada = {
      id: operacionIdEdit,
      descripcion,
      monto,
      tipoOperacion,
      categoria,
      fecha,
    };

    operaciones = operaciones.map(op => op.id === operacionIdEdit ? operacionEditada : op);
    actualizarTablaOperaciones();
    editOperationSection.classList.add('hidden'); // Ocultar formulario de edición
    actualizarBalance(); // Actualizar balance después de editar
  });

  document.getElementById('cancel-edit-button').addEventListener('click', () => {
    editOperationSection.classList.add('hidden'); // Ocultar el formulario de edición
    limpiarFormularioEdicion();
  });

  function limpiarFormularioEdicion() {
    document.getElementById('edit-description-operation').value = '';
    document.getElementById('edit-operation-amount').value = '0';
    document.getElementById('edit-type-operation').value = 'gasto';
    document.getElementById('edit-category-operation').value = 'comida';
    document.getElementById('edit-date-operation').value = '';
  }
  });
