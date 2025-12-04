// Script para manejar el formulario de contacto con backend PHP
(function() {
    'use strict';
    
    // Esperar a que el DOM esté cargado
    document.addEventListener('DOMContentLoaded', function() {
        // Buscar el formulario de contacto
        const form = document.querySelector('form[class*="space-y-6"]');
        
        if (!form) {
            console.log('Formulario de contacto no encontrado en esta página');
            return;
        }
        
        console.log('Formulario de contacto encontrado, configurando handler PHP...');
        
        // Prevenir el comportamiento original
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.innerHTML : '';
            
            // Obtener datos del formulario
            const formData = {
                name: form.querySelector('#name')?.value || '',
                email: form.querySelector('#email')?.value || '',
                phone: form.querySelector('#phone')?.value || '',
                company: form.querySelector('#company')?.value || '',
                service: form.querySelector('#service')?.value || '',
                message: form.querySelector('#message')?.value || ''
            };
            
            // Validar campos requeridos
            if (!formData.name || !formData.email || !formData.message) {
                showMessage('Por favor completa todos los campos requeridos', 'error');
                return;
            }
            
            // Deshabilitar botón y mostrar estado de envío
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <div class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                    </div>
                `;
            }
            
            try {
                // Enviar a la API PHP
                const response = await fetch('/api/contact.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    showMessage(result.message || '¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
                    form.reset(); // Limpiar formulario
                } else {
                    showMessage(result.message || 'Error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Error al enviar el mensaje. Por favor verifica tu conexión e intenta de nuevo.', 'error');
            } finally {
                // Restaurar botón
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
            }
        }, true); // Usar capture para interceptar antes que otros handlers
        
        // Función para mostrar mensajes
        function showMessage(message, type) {
            // Remover mensajes anteriores
            const oldMessages = form.querySelectorAll('.contact-form-message');
            oldMessages.forEach(msg => msg.remove());
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'contact-form-message';
            
            if (type === 'success') {
                messageDiv.className += ' bg-green-50 border border-green-200 rounded-lg p-4 mb-4';
                messageDiv.innerHTML = `
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <p class="text-green-700 font-medium">${message}</p>
                    </div>
                `;
            } else {
                messageDiv.className += ' bg-red-50 border border-red-200 rounded-lg p-4 mb-4';
                messageDiv.innerHTML = `
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-red-700 font-medium">${message}</p>
                    </div>
                `;
            }
            
            // Insertar antes del botón de submit
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.parentElement.insertBefore(messageDiv, submitButton);
            } else {
                form.appendChild(messageDiv);
            }
            
            // Auto-remover después de 5 segundos
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    });
})();
