'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function CondicionesPage() {
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
          <h1 className="text-4xl font-bold text-white mb-3">Condiciones de Servicio</h1>
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
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introducción y Aceptación</h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                Bienvenido a <span className="text-white font-medium">Fromelabs</span>, una plataforma de inteligencia artificial conversacional desarrollada y operada por 
                <span className="text-white font-medium"> FROM E SYSTEMS Inc.</span> (en adelante, "nosotros", "nuestro" o "FROM E").
              </p>
              <p>
                Al acceder, registrarte o utilizar cualquier funcionalidad de Fromelabs (el "Servicio"), aceptas quedar vinculado por estas 
                Condiciones de Servicio (las "Condiciones"), así como por nuestra{' '}
                <Link href="/legal/privacidad" className="text-blue-400 hover:text-blue-300 underline">
                  Política de Privacidad
                </Link>{' '}
                y{' '}
                <Link href="/legal/uso-aceptable" className="text-blue-400 hover:text-blue-300 underline">
                  Política de Uso Aceptable
                </Link>.
              </p>
              <p>
                Si no estás de acuerdo con alguna parte de estas Condiciones, <span className="text-white font-medium">no debes utilizar el Servicio</span>.
              </p>
            </div>
          </section>

          {/* 2. Descripción del Servicio */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Descripción del Servicio</h2>
            <div className="space-y-4 leading-relaxed">
              <p>Fromelabs proporciona acceso a sistemas de inteligencia artificial conversacional (denominados "Cognitive Counterparts") que permiten a los usuarios:</p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>Mantener conversaciones naturales con modelos de IA de última generación (Claude de Anthropic, entre otros)</li>
                <li>Generar contenido textual, código, análisis y respuestas personalizadas</li>
                <li>Generar imágenes mediante tecnología Stable Diffusion (v3.0+)</li>
                <li>Interactuar mediante comandos de voz (speech-to-text y text-to-speech) (v3.0+)</li>
                <li>Acceder a memoria persistente de conversaciones y contexto</li>
                <li>Integrar webhooks y API keys para automatización (planes PRO y superiores)</li>
              </ul>
              <p>El Servicio se presta "tal cual" y puede incluir funcionalidades experimentales marcadas como "beta" o "preview".</p>
            </div>
          </section>

          {/* 3. Registro y Cuenta */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Registro y Cuenta de Usuario</h2>
            
            <h3 className="text-xl font-medium text-white mb-3 mt-6">3.1 Requisitos de Registro</h3>
            <p className="mb-3">Para utilizar Fromelabs, debes:</p>
            <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6 mb-6">
              <li>Tener al menos <span className="text-white font-medium">18 años de edad</span> (o la mayoría de edad legal en tu jurisdicción)</li>
              <li>Proporcionar información veraz, precisa y actualizada durante el registro</li>
              <li>Mantener la confidencialidad de tus credenciales de acceso</li>
              <li>Notificarnos inmediatamente si detectas uso no autorizado de tu cuenta</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">3.2 Responsabilidad de la Cuenta</h3>
            <p>
              Eres responsable de todas las actividades realizadas desde tu cuenta. FROM E no se responsabiliza por pérdidas derivadas 
              del uso no autorizado de tus credenciales, salvo negligencia probada por nuestra parte.
            </p>
          </section>

          {/* 4. Planes y Suscripciones */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Planes y Suscripciones</h2>
            <p className="mb-6">Fromelabs ofrece diferentes planes de suscripción con límites de uso y funcionalidades variables:</p>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Plan</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Precio</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Mensajes/Mes</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Características</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4 font-medium text-white">FREE</td>
                    <td className="px-6 py-4">0€</td>
                    <td className="px-6 py-4">50</td>
                    <td className="px-6 py-4">Acceso básico, memoria 7 días</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4 font-medium text-white">STARTER</td>
                    <td className="px-6 py-4">9€/mes</td>
                    <td className="px-6 py-4">500</td>
                    <td className="px-6 py-4">Memoria 30 días, prioridad normal</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4 font-medium text-white">PRO</td>
                    <td className="px-6 py-4">29€/mes</td>
                    <td className="px-6 py-4">2.000</td>
                    <td className="px-6 py-4">API, webhooks, memoria ilimitada, sin ads</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4 font-medium text-white">BUSINESS</td>
                    <td className="px-6 py-4">99€/mes</td>
                    <td className="px-6 py-4">10.000</td>
                    <td className="px-6 py-4">Multi-usuario (5), analytics avanzado, SLA 99.5%</td>
                  </tr>
                  <tr className="hover:bg-gray-900/50">
                    <td className="px-6 py-4 font-medium text-white">ENTERPRISE</td>
                    <td className="px-6 py-4">Personalizado</td>
                    <td className="px-6 py-4">Ilimitado</td>
                    <td className="px-6 py-4">On-premise, SLA 99.9%, soporte 24/7</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              Los límites de mensajes se reinician el primer día de cada ciclo de facturación. El uso excesivo puede resultar en 
              limitación temporal del servicio o cobros adicionales según se indique en tu plan.
            </p>
          </section>

          {/* 5. Pagos */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Pagos y Facturación</h2>
            
            <h3 className="text-xl font-medium text-white mb-3 mt-6">5.1 Procesamiento de Pagos</h3>
            <p className="mb-6">
              Los pagos se procesan mediante <span className="text-white font-medium">Stripe</span>, un procesador de pagos PCI-DSS certificado. FROM E no almacena 
              ni tiene acceso a los datos completos de tu tarjeta de crédito.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">5.2 Renovación Automática</h3>
            <p className="mb-6">
              Las suscripciones se renuevan automáticamente al final de cada período de facturación, salvo que canceles antes de la 
              fecha de renovación. Te notificaremos por correo electrónico antes de cada cargo.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">5.3 Impuestos</h3>
            <p className="mb-6">
              Los precios no incluyen IVA ni otros impuestos aplicables según tu jurisdicción. Estos se añadirán al importe final 
              según corresponda por ley.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">5.4 Reembolsos</h3>
            <p>
              No ofrecemos reembolsos por períodos de suscripción parcialmente utilizados, salvo en casos de error demostrable 
              por nuestra parte o según lo exigido por la normativa de consumo aplicable.
            </p>
          </section>

          {/* 6. Cancelación */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cancelación y Suspensión</h2>
            
            <h3 className="text-xl font-medium text-white mb-3 mt-6">6.1 Cancelación por el Usuario</h3>
            <p className="mb-6">
              Puedes cancelar tu suscripción en cualquier momento desde la sección "Account" de tu panel. La cancelación tendrá 
              efecto al final del período de facturación actual. No se realizarán cargos posteriores.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">6.2 Derecho de Desistimiento (Consumidores UE)</h3>
            <div className="space-y-4">
              <p>
                Conforme al artículo 102 del Real Decreto Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios), 
                los consumidores en España y la Unión Europea tienen derecho a desistir del contrato en un plazo de <span className="text-white font-medium">14 días naturales</span> 
                desde la contratación, sin necesidad de justificación.
              </p>
              <p>
                Para ejercer este derecho, envía un correo a <a href="mailto:soporte@fromelabs.com" className="text-blue-400 hover:text-blue-300 underline">soporte@fromelabs.com</a> indicando 
                tu nombre completo, email de registro y número de pedido. El reembolso se procesará en un plazo máximo de 14 días.
              </p>
            </div>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">6.3 Suspensión o Cancelación por FROM E</h3>
            <p className="mb-3">Nos reservamos el derecho de suspender o cancelar tu cuenta si:</p>
            <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
              <li>Incumples estas Condiciones o nuestra Política de Uso Aceptable</li>
              <li>Detectamos actividad fraudulenta o uso indebido del Servicio</li>
              <li>No se pueden procesar los pagos de tu suscripción</li>
              <li>Recibes reiteradas reclamaciones de terceros fundamentadas</li>
            </ul>
          </section>

          {/* 7. Propiedad Intelectual */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Propiedad Intelectual</h2>
            
            <h3 className="text-xl font-medium text-white mb-3 mt-6">7.1 Contenido del Usuario</h3>
            <div className="space-y-4">
              <p>
                Conservas todos los derechos sobre el contenido que generes utilizando Fromelabs ("Contenido del Usuario"). 
                Al utilizar el Servicio, nos otorgas una licencia mundial, no exclusiva, libre de regalías y transferible para:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>Procesar, almacenar y transmitir tu Contenido para prestar el Servicio</li>
                <li>Mejorar y entrenar nuestros modelos de IA (salvo en planes Enterprise con cláusulas específicas)</li>
                <li>Cumplir con obligaciones legales o regulatorias</li>
              </ul>
              <p><span className="text-white font-medium">No reclamamos propiedad sobre tu Contenido.</span> Puedes eliminarlo en cualquier momento desde tu cuenta.</p>
            </div>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">7.2 Contenido de FROM E</h3>
            <p>
              Todos los elementos de Fromelabs (software, diseño, logos, marca "FROM E SYSTEMS", documentación, etc.) son propiedad 
              exclusiva de FROM E SYSTEMS Inc. y están protegidos por derechos de autor, marcas registradas y otras leyes de 
              propiedad intelectual.
            </p>
          </section>

          {/* 8. Limitación de Responsabilidad */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Limitación de Responsabilidad</h2>
            <div className="space-y-4">
              <p>En la máxima medida permitida por la ley aplicable:</p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>Fromelabs se proporciona <span className="text-white font-medium">"tal cual"</span> y <span className="text-white font-medium">"según disponibilidad"</span>, sin garantías de ningún tipo</li>
                <li>No garantizamos que el Servicio esté libre de errores, interrupciones, virus o componentes dañinos</li>
                <li>No nos responsabilizamos por la exactitud, veracidad o legalidad del contenido generado por la IA</li>
                <li>No somos responsables de decisiones tomadas basándose exclusivamente en respuestas de la IA</li>
                <li>Nuestra responsabilidad máxima se limita al importe pagado por el Servicio en los 12 meses anteriores al evento reclamado</li>
              </ul>
              <p className="text-sm">Esto no afecta a los derechos legales que no pueden ser excluidos por ley (como garantías de consumo en la UE).</p>
            </div>
          </section>

          {/* 9. Uso Aceptable */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Uso Aceptable del Servicio</h2>
            <div className="space-y-4">
              <p>
                Al utilizar Fromelabs, te comprometes a cumplir nuestra{' '}
                <Link href="/legal/uso-aceptable" className="text-blue-400 hover:text-blue-300 underline">
                  Política de Uso Aceptable
                </Link>, que prohíbe explícitamente:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>Actividades ilegales o que infrinjan derechos de terceros</li>
                <li>Generación de contenido dañino, abusivo, fraudulento o de odio</li>
                <li>Ataques a infraestructuras críticas o ciberseguridad</li>
                <li>Desarrollo de armas o sistemas de vigilancia ilegal</li>
                <li>Explotación, abuso o puesta en riesgo de menores</li>
                <li>Desinformación deliberada o suplantación de identidad</li>
                <li>Contenido sexual explícito o material de abuso</li>
              </ul>
              <p>
                La violación de estas políticas puede resultar en la suspensión inmediata de tu cuenta y la denuncia a las autoridades competentes.
              </p>
            </div>
          </section>

          {/* 10. Protección de Datos */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Protección de Datos Personales</h2>
            <div className="space-y-4">
              <p>
                El tratamiento de tus datos personales se rige por nuestra{' '}
                <Link href="/legal/privacidad" className="text-blue-400 hover:text-blue-300 underline">
                  Política de Privacidad
                </Link>, que cumple con:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li><span className="text-white font-medium">RGPD</span> (Reglamento (UE) 2016/679)</li>
                <li><span className="text-white font-medium">LOPDGDD</span> (Ley Orgánica 3/2018 de Protección de Datos española)</li>
                <li><span className="text-white font-medium">LSSI</span> (Ley 34/2002 de Servicios de la Sociedad de la Información)</li>
              </ul>
              <p>
                Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, portabilidad y limitación contactando con 
                nuestro DPO en <a href="mailto:dpo@fromelabs.com" className="text-blue-400 hover:text-blue-300 underline">dpo@fromelabs.com</a>.
              </p>
            </div>
          </section>

          {/* 11. Modificaciones */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Modificaciones de las Condiciones</h2>
            <div className="space-y-4">
              <p>
                Podemos modificar estas Condiciones ocasionalmente para reflejar cambios en el Servicio, requisitos legales o mejoras. 
                Te notificaremos los cambios sustanciales mediante:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>Correo electrónico a tu dirección registrada</li>
                <li>Aviso prominente en la plataforma</li>
                <li>Actualización de la fecha "Última actualización" en este documento</li>
              </ul>
              <p>
                El uso continuado del Servicio tras la notificación constituye tu aceptación de las nuevas Condiciones. Si no estás de acuerdo, 
                debes dejar de usar el Servicio y cancelar tu cuenta.
              </p>
            </div>
          </section>

          {/* 12. Jurisdicción */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Jurisdicción y Ley Aplicable</h2>
            <div className="space-y-4">
              <p>
                Estas Condiciones se rigen e interpretan de acuerdo con la legislación española. Para la resolución de cualquier controversia, 
                las partes se someten a los juzgados y tribunales de <span className="text-white font-medium">Reus (Tarragona, España)</span>, renunciando expresamente a 
                cualquier otro fuero que pudiera corresponderles.
              </p>
              <p>Sin perjuicio de lo anterior, si eres consumidor residente en la Unión Europea, puedes presentar reclamaciones ante los organismos de resolución alternativa de litigios:</p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>
                  <span className="text-white font-medium">Plataforma ODR:</span>{' '}
                  <a 
                    href="https://ec.europa.eu/consumers/odr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                </li>
                <li><span className="text-white font-medium">Consumo Responde (España):</span> 900 870 700</li>
              </ul>
            </div>
          </section>

          {/* 13. Contacto */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Información de Contacto</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-white font-medium">Responsable:</span>
                  <span className="ml-2">FROM E SYSTEMS Inc.</span>
                </div>
                <div>
                  <span className="text-white font-medium">Domicilio social:</span>
                  <span className="ml-2">Reus, Tarragona, España</span>
                </div>
                <div>
                  <span className="text-white font-medium">Email de soporte:</span>
                  <a href="mailto:soporte@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    soporte@fromelabs.com
                  </a>
                </div>
                <div>
                  <span className="text-white font-medium">Email legal:</span>
                  <a href="mailto:legal@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    legal@fromelabs.com
                  </a>
                </div>
                <div>
                  <span className="text-white font-medium">DPO:</span>
                  <a href="mailto:dpo@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    dpo@fromelabs.com
                  </a>
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
              <Link href="/legal/privacidad" className="text-gray-400 hover:text-blue-400 transition">
                Política de Privacidad
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
