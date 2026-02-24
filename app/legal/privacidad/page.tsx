'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header con logo */}
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/" className="inline-block">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <div className="text-white font-semibold text-lg">FROM E SYSTEMS</div>
                <div className="text-gray-500 text-xs">Fromelabs v3.0</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Título */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Política de Privacidad</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>FROM E SYSTEMS Inc.</span>
            <span>•</span>
            <span>Última actualización: 23 de febrero de 2026</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-12 text-gray-300">
          
          {/* 1. Introducción */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introducción</h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                <span className="text-white font-medium">FROM E SYSTEMS Inc.</span> (en adelante "FROM E", "nosotros" o "nuestro") es el responsable del tratamiento 
                de tus datos personales recabados a través de <span className="text-white font-medium">Fromelabs</span>, nuestra plataforma de inteligencia artificial conversacional.
              </p>
              <p>
                Esta Política de Privacidad explica qué datos personales recogemos, cómo los utilizamos, con quién los compartimos, 
                cuánto tiempo los conservamos y cuáles son tus derechos en relación con ellos, conforme a:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li><span className="text-white font-medium">RGPD</span> – Reglamento General de Protección de Datos (UE) 2016/679</li>
                <li><span className="text-white font-medium">LOPDGDD</span> – Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (España)</li>
                <li><span className="text-white font-medium">LSSI</span> – Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico</li>
              </ul>
            </div>
          </section>

          {/* 2. Responsable */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Responsable del Tratamiento</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-white font-medium">Identidad:</span>
                  <span className="ml-2">FROM E SYSTEMS Inc.</span>
                </div>
                <div>
                  <span className="text-white font-medium">Domicilio:</span>
                  <span className="ml-2">Reus, Tarragona, España</span>
                </div>
                <div>
                  <span className="text-white font-medium">Email de contacto:</span>
                  <a href="mailto:privacidad@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    privacidad@fromelabs.com
                  </a>
                </div>
                <div>
                  <span className="text-white font-medium">Delegado de Protección de Datos (DPO):</span>
                  <a href="mailto:dpo@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    dpo@fromelabs.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Datos que Recogemos */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Datos Personales que Recogemos</h2>
            
            <h3 className="text-xl font-medium text-white mb-3 mt-6">3.1 Datos de Registro y Cuenta</h3>
            <p className="mb-2">Cuando creas una cuenta en Fromelabs, recogemos:</p>
            <ul className="space-y-1 ml-6 border-l-2 border-gray-800 pl-6 mb-6">
              <li><span className="text-white font-medium">Nombre completo</span></li>
              <li><span className="text-white font-medium">Dirección de correo electrónico</span></li>
              <li><span className="text-white font-medium">Contraseña cifrada</span> (nunca almacenamos contraseñas en texto plano)</li>
              <li><span className="text-white font-medium">Fecha y hora de registro</span></li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">3.2 Datos de Uso del Servicio</h3>
            <p className="mb-2">Durante tu uso de Fromelabs, recogemos:</p>
            <ul className="space-y-1 ml-6 border-l-2 border-gray-800 pl-6 mb-6">
              <li><span className="text-white font-medium">Conversaciones con la IA</span> (prompts, respuestas, contexto)</li>
              <li><span className="text-white font-medium">Imágenes generadas</span> (en planes con Stable Diffusion)</li>
              <li><span className="text-white font-medium">Comandos de voz</span> (transcripciones de speech-to-text)</li>
              <li><span className="text-white font-medium">Metadatos de uso:</span> timestamps, número de mensajes, modelos utilizados, duraciones de sesión</li>
              <li><span className="text-white font-medium">Preferencias de configuración:</span> idioma, tema visual, notificaciones</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">3.3 Datos de Pago y Facturación</h3>
            <div className="space-y-4 mb-6">
              <p>Para procesar suscripciones de pago, utilizamos <span className="text-white font-medium">Stripe</span> como procesador de pagos. Recogemos:</p>
              <ul className="space-y-1 ml-6 border-l-2 border-gray-800 pl-6">
                <li><span className="text-white font-medium">Datos de facturación:</span> nombre, dirección postal, país, NIF/CIF (si aplica)</li>
                <li><span className="text-white font-medium">Últimos 4 dígitos de la tarjeta</span> (Stripe gestiona los datos completos de pago)</li>
                <li><span className="text-white font-medium">Historial de transacciones:</span> fechas, importes, plan contratado</li>
              </ul>
              <p className="text-sm text-gray-400 italic">
                FROM E nunca almacena ni tiene acceso a los datos completos de tu tarjeta de crédito. Stripe cumple con PCI-DSS nivel 1.
              </p>
            </div>

            <h3 className="text-xl font-medium text-white mb-3">3.4 Datos Técnicos y de Navegación</h3>
            <p className="mb-2">Recogemos automáticamente:</p>
            <ul className="space-y-1 ml-6 border-l-2 border-gray-800 pl-6 mb-6">
              <li><span className="text-white font-medium">Dirección IP</span></li>
              <li><span className="text-white font-medium">Tipo de navegador y versión</span></li>
              <li><span className="text-white font-medium">Sistema operativo</span></li>
              <li><span className="text-white font-medium">Dispositivo utilizado</span> (desktop, móvil, tablet)</li>
              <li><span className="text-white font-medium">Cookies y tecnologías similares</span> (ver sección 9)</li>
              <li><span className="text-white font-medium">Páginas visitadas, clics, tiempo en sitio</span></li>
              <li><span className="text-white font-medium">URL de referencia</span> (página desde la que llegaste)</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">3.5 Datos de Comunicación</h3>
            <p className="mb-2">Si contactas con nuestro equipo de soporte, recogemos:</p>
            <ul className="space-y-1 ml-6 border-l-2 border-gray-800 pl-6">
              <li><span className="text-white font-medium">Contenido de tus mensajes</span></li>
              <li><span className="text-white font-medium">Archivos adjuntos</span> (capturas de pantalla, logs, etc.)</li>
              <li><span className="text-white font-medium">Historial de tickets de soporte</span></li>
            </ul>
          </section>

          {/* 4. Finalidades */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Finalidades del Tratamiento y Bases Legales</h2>
            <p className="mb-6">
              Tratamos tus datos personales para las siguientes finalidades, cada una basada en una legitimación específica 
              conforme al artículo 6 del RGPD:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Finalidad</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Base Legal (RGPD Art. 6.1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Creación y gestión de tu cuenta</td>
                    <td className="px-6 py-4">(b) Ejecución del contrato</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Prestación del servicio Fromelabs (IA conversacional)</td>
                    <td className="px-6 py-4">(b) Ejecución del contrato</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Procesamiento de pagos y facturación</td>
                    <td className="px-6 py-4">(b) Ejecución del contrato</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Cumplimiento de obligaciones fiscales y contables</td>
                    <td className="px-6 py-4">(c) Obligación legal</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Mejora de modelos de IA (entrenamiento, fine-tuning)</td>
                    <td className="px-6 py-4">(a) Consentimiento explícito*</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Análisis de uso y estadísticas agregadas</td>
                    <td className="px-6 py-4">(f) Interés legítimo</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Prevención de fraude y abuso</td>
                    <td className="px-6 py-4">(f) Interés legítimo</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Soporte técnico y atención al cliente</td>
                    <td className="px-6 py-4">(b) Ejecución del contrato</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Envío de notificaciones del servicio</td>
                    <td className="px-6 py-4">(b) Ejecución del contrato</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">Envío de comunicaciones comerciales (newsletters)</td>
                    <td className="px-6 py-4">(a) Consentimiento (opt-in)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-400 mt-4 italic">
              * El uso de tus conversaciones para entrenamiento de modelos es opcional. Puedes desactivarlo en tu configuración de cuenta. 
              Los planes Enterprise pueden excluir esta finalidad por contrato.
            </p>
          </section>

          {/* 5. Compartición */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Con Quién Compartimos tus Datos</h2>
            <p className="mb-4">
              No vendemos ni alquilamos tus datos personales a terceros. Compartimos datos únicamente en los siguientes casos:
            </p>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">5.1 Proveedores de Servicios (Encargados del Tratamiento)</h3>
            <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6 mb-6">
              <li>
                <span className="text-white font-medium">Anthropic (Claude AI)</span> – Procesamiento de conversaciones mediante API.{' '}
                <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300 underline">
                  Ver su política
                </a>
              </li>
              <li>
                <span className="text-white font-medium">Stripe</span> – Procesamiento de pagos con tarjeta. Cumple PCI-DSS.{' '}
                <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300 underline">
                  Ver su política
                </a>
              </li>
              <li><span className="text-white font-medium">Servicios de hosting</span> – Almacenamiento de bases de datos y archivos (servidores en UE/EEE)</li>
              <li><span className="text-white font-medium">Servicios de email transaccional</span> – Envío de notificaciones y confirmaciones</li>
            </ul>
            <p className="text-sm text-gray-400 mb-6 italic">
              Todos nuestros proveedores firman acuerdos de procesamiento de datos (DPA) conformes al artículo 28 del RGPD.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">5.2 Obligaciones Legales</h3>
            <p className="mb-6">
              Podemos divulgar datos si lo exige la ley, una orden judicial, o autoridades competentes (policía, tribunales, 
              autoridades fiscales), especialmente en casos de investigación de delitos o cumplimiento de normativa.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">5.3 Transferencias Internacionales</h3>
            <div className="space-y-4">
              <p>
                Algunos proveedores (como Anthropic) pueden estar ubicados fuera del Espacio Económico Europeo (EEE). En esos casos, 
                aseguramos que las transferencias cumplan con el capítulo V del RGPD mediante:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li><span className="text-white font-medium">Cláusulas Contractuales Tipo (SCC)</span> aprobadas por la Comisión Europea</li>
                <li><span className="text-white font-medium">Decisiones de adecuación</span> (países con nivel de protección equivalente)</li>
                <li><span className="text-white font-medium">Mecanismos de certificación</span> reconocidos</li>
              </ul>
            </div>
          </section>

          {/* 6. Conservación */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Conservación de tus Datos</h2>
            <div className="space-y-4">
              <p>
                Conservamos tus datos personales durante el tiempo necesario para cumplir las finalidades descritas, y posteriormente 
                conforme a los siguientes criterios:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li><span className="text-white font-medium">Datos de cuenta activa:</span> Mientras mantengas tu cuenta abierta</li>
                <li><span className="text-white font-medium">Conversaciones y memoria persistente:</span> Según límites de tu plan (7/30/90 días o ilimitado en PRO+)</li>
                <li><span className="text-white font-medium">Datos de facturación:</span> 10 años desde última transacción (obligación fiscal española)</li>
                <li><span className="text-white font-medium">Logs de seguridad y acceso:</span> 2 años (cumplimiento LSSI)</li>
                <li><span className="text-white font-medium">Datos tras cancelación de cuenta:</span> Eliminación en 30 días (salvo datos que debamos conservar por ley)</li>
              </ul>
              <p>
                Puedes solicitar la eliminación anticipada de tus datos ejerciendo tu derecho de supresión (ver sección 8).
              </p>
            </div>
          </section>

          {/* 7. Seguridad */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Medidas de Seguridad</h2>
            <div className="space-y-4">
              <p>
                Aplicamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida, alteración o divulgación:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li><span className="text-white font-medium">Cifrado TLS/SSL</span> para todas las comunicaciones</li>
                <li><span className="text-white font-medium">Cifrado en reposo</span> para bases de datos y archivos sensibles</li>
                <li><span className="text-white font-medium">Autenticación robusta</span> con hashing bcrypt para contraseñas</li>
                <li><span className="text-white font-medium">Control de acceso basado en roles (RBAC)</span></li>
                <li><span className="text-white font-medium">Auditorías de seguridad</span> regulares y pentesting</li>
                <li><span className="text-white font-medium">Copias de seguridad cifradas</span> en ubicaciones geográficamente separadas</li>
                <li><span className="text-white font-medium">Monitorización 24/7</span> de amenazas y eventos de seguridad</li>
                <li><span className="text-white font-medium">Políticas de acceso mínimo privilegiado</span> para empleados</li>
              </ul>
              <p className="text-sm text-gray-400 italic">
                En caso de brecha de seguridad que afecte tus datos, te notificaremos en un plazo máximo de 72 horas conforme al artículo 33 del RGPD.
              </p>
            </div>
          </section>

          {/* 8. Derechos */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Tus Derechos sobre tus Datos</h2>
            <p className="mb-6">
              Conforme al RGPD y la LOPDGDD, tienes los siguientes derechos:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-900 border-l-4 border-blue-700 p-5">
                <h4 className="font-semibold text-white mb-2">Derecho de Acceso (Art. 15 RGPD)</h4>
                <p className="text-sm">Obtener confirmación de si tratamos tus datos y acceder a una copia de los mismos.</p>
              </div>

              <div className="bg-gray-900 border-l-4 border-blue-700 p-5">
                <h4 className="font-semibold text-white mb-2">Derecho de Rectificación (Art. 16 RGPD)</h4>
                <p className="text-sm">Corregir datos inexactos o incompletos.</p>
              </div>

              <div className="bg-gray-900 border-l-4 border-blue-700 p-5">
                <h4 className="font-semibold text-white mb-2">Derecho de Supresión / "Derecho al Olvido" (Art. 17 RGPD)</h4>
                <p className="text-sm">
                  Solicitar la eliminación de tus datos cuando ya no sean necesarios, retires tu consentimiento, 
                  o se hayan tratado ilícitamente.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-blue-700 p-5">
                <h4 className="font-semibold text-white mb-2">Derecho de Limitación (Art. 18 RGPD)</h4>
                <p className="text-sm">
                  Solicitar que bloqueemos temporalmente el tratamiento de tus datos mientras se verifica su exactitud o la legitimidad del tratamiento.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-blue-700 p-5">
                <h4 className="font-semibold text-white mb-2">Derecho de Portabilidad (Art. 20 RGPD)</h4>
                <p className="text-sm">
                  Recibir tus datos en formato estructurado, de uso común y lectura mecánica (JSON/CSV) para transmitirlos a otro responsable.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-blue-700 p-5">
                <h4 className="font-semibold text-white mb-2">Derecho de Oposición (Art. 21 RGPD)</h4>
                <p className="text-sm">
                  Oponerte al tratamiento de tus datos basado en interés legítimo, incluido el uso para marketing directo.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-blue-700 p-5">
                <h4 className="font-semibold text-white mb-2">Derecho a No Ser Objeto de Decisiones Automatizadas (Art. 22 RGPD)</h4>
                <p className="text-sm">
                  No ser objeto de decisiones basadas únicamente en tratamiento automatizado que produzcan efectos jurídicos significativos.
                </p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-medium text-white mb-4">Cómo ejercer tus derechos</h3>
              <div className="space-y-4">
                <p>Puedes ejercer cualquiera de estos derechos enviando un correo a:</p>
                <p className="text-white text-lg">
                  <a href="mailto:dpo@fromelabs.com" className="text-blue-400 hover:text-blue-300 underline">
                    dpo@fromelabs.com
                  </a>
                </p>
                <p className="text-sm">
                  Incluye en tu solicitud: nombre completo, email de cuenta, derecho que deseas ejercer y copia de tu DNI/NIE 
                  (para verificar identidad). Responderemos en un plazo máximo de <span className="text-white font-medium">30 días</span>.
                </p>
                <p className="text-sm">
                  Si no estás satisfecho con nuestra respuesta, puedes presentar una reclamación ante la <span className="text-white font-medium">Agencia Española de Protección de Datos (AEPD)</span>:
                </p>
                <ul className="text-sm space-y-1 ml-6 border-l-2 border-gray-800 pl-6">
                  <li>
                    <a href="https://www.aepd.es" target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300 underline">
                      www.aepd.es
                    </a>
                  </li>
                  <li>C/ Jorge Juan, 6, 28001 Madrid</li>
                  <li>901 100 099 / 912 663 517</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 9. Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Política de Cookies</h2>
            <div className="space-y-4">
              <p>
                Fromelabs utiliza cookies y tecnologías similares para mejorar tu experiencia, analizar el uso del servicio y personalizar contenido. 
                Conforme a la LSSI (Ley 34/2002) y el artículo 22.2 de la LSSI modificada por el Real Decreto-ley 13/2012, te informamos de:
              </p>

              <h3 className="text-xl font-medium text-white mb-3 mt-6">9.1 Tipos de Cookies que Utilizamos</h3>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>
                  <span className="text-white font-medium">Cookies Técnicas (Necesarias):</span> Esenciales para el funcionamiento del sitio (autenticación, sesión, seguridad). 
                  No requieren consentimiento.
                </li>
                <li>
                  <span className="text-white font-medium">Cookies Analíticas:</span> Nos ayudan a entender cómo usas Fromelabs (páginas visitadas, errores, tiempo de sesión). 
                  Requieren consentimiento.
                </li>
                <li>
                  <span className="text-white font-medium">Cookies de Preferencias:</span> Guardan tus ajustes (tema oscuro/claro, idioma). Requieren consentimiento.
                </li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3 mt-6">9.2 Gestión de Cookies</h3>
              <p className="mb-2">Al acceder a Fromelabs, se te presenta un banner de cookies donde puedes:</p>
              <ul className="space-y-1 ml-6 border-l-2 border-gray-800 pl-6 mb-4">
                <li>Aceptar todas las cookies</li>
                <li>Rechazar cookies no esenciales</li>
                <li>Configurar cookies por categoría</li>
              </ul>
              <p className="text-sm text-gray-400">
                También puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que esto puede afectar 
                al funcionamiento del servicio.
              </p>
            </div>
          </section>

          {/* 10. Menores */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Protección de Menores</h2>
            <div className="space-y-4">
              <p>
                Fromelabs está dirigido a personas mayores de <span className="text-white font-medium">18 años</span>. No recogemos intencionadamente datos de menores de edad.
              </p>
              <p>
                Conforme al artículo 7 de la LOPDGDD, para menores de 14 años se requiere el consentimiento de los titulares de la patria potestad 
                o tutela para el tratamiento de sus datos personales.
              </p>
              <p>
                Si detectamos que hemos recogido datos de un menor sin consentimiento parental, eliminaremos esa información de nuestros sistemas 
                de forma inmediata. Si eres padre/madre/tutor y crees que tu hijo ha proporcionado datos, contacta con{' '}
                <a href="mailto:dpo@fromelabs.com" className="text-blue-400 hover:text-blue-300 underline">dpo@fromelabs.com</a>.
              </p>
            </div>
          </section>

          {/* 11. Modificaciones */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Modificaciones de esta Política</h2>
            <div className="space-y-4">
              <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras prácticas, tecnología o requisitos legales. 
                Te notificaremos cambios materiales mediante:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>Correo electrónico a tu dirección registrada</li>
                <li>Aviso destacado en la plataforma</li>
                <li>Actualización de la fecha "Última actualización" en la parte superior</li>
              </ul>
              <p>
                Te recomendamos revisar esta política periódicamente. El uso continuado del servicio tras la publicación de cambios 
                constituye tu aceptación de la política revisada.
              </p>
            </div>
          </section>

          {/* 12. Contacto */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contacto</h2>
            <p className="mb-4">
              Para cualquier consulta sobre esta Política de Privacidad o el tratamiento de tus datos personales:
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-white font-medium">Correo general:</span>
                  <a href="mailto:privacidad@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    privacidad@fromelabs.com
                  </a>
                </div>
                <div>
                  <span className="text-white font-medium">Delegado de Protección de Datos:</span>
                  <a href="mailto:dpo@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    dpo@fromelabs.com
                  </a>
                </div>
                <div>
                  <span className="text-white font-medium">Dirección postal:</span>
                  <span className="ml-2">FROM E SYSTEMS Inc., Reus, Tarragona, España</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">
              © 2026 FROM E SYSTEMS Inc. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/legal/condiciones" className="text-gray-400 hover:text-blue-400 transition">
                Condiciones de Servicio
              </Link>
              <Link href="/legal/uso-aceptable" className="text-gray-400 hover:text-blue-400 transition">
                Uso Aceptable
              </Link>
              <Link href="/" className="text-blue-400 hover:text-blue-300 transition">
                Volver a Fromelabs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
