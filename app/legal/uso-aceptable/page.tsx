'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function UsoAceptablePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header con logo */}
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/" className="inline-block">
            <div className="flex items-center space-x-3">
              <Image src="/logo-from-e.png" alt="FROM E SYSTEMS" width={40} height={40} />
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
          <h1 className="text-4xl font-bold text-white mb-3">Política de Uso Aceptable</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>FROM E SYSTEMS Inc.</span>
            <span>•</span>
            <span>Última actualización: 23 de febrero de 2026</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-12 text-gray-300">
          
          {/* Introducción */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introducción</h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                Esta Política de Uso Aceptable (también denominada "PUA") se aplica a cualquier persona que utilice <span className="text-white font-medium">Fromelabs</span>, 
                la plataforma de inteligencia artificial conversacional de <span className="text-white font-medium">FROM E SYSTEMS Inc.</span>
              </p>
              <p>El objetivo de esta política es:</p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li>Proteger a nuestros usuarios y a la comunidad</li>
                <li>Promover el uso responsable y ético de la inteligencia artificial</li>
                <li>Prevenir daños y actividades ilegales</li>
                <li>Cumplir con las leyes y regulaciones aplicables</li>
              </ul>
              <p>
                Esta política se actualiza periódicamente a medida que nuestra tecnología evoluciona y conocemos nuevos riesgos. 
                El incumplimiento de esta Política puede resultar en la <span className="text-white font-medium">suspensión o cancelación inmediata</span> de tu cuenta, 
                así como en la denuncia a las autoridades competentes cuando proceda.
              </p>
              <p>
                Si detectas contenido o uso que viole esta política, repórtalo a{' '}
                <a href="mailto:usersafety@fromelabs.com" className="text-blue-400 hover:text-blue-300 underline">
                  usersafety@fromelabs.com
                </a>.
              </p>
            </div>
          </section>

          {/* Estándares Universales */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Estándares de Uso Universal</h2>
            <p className="mb-6">
              Los siguientes estándares se aplican a <span className="text-white font-medium">todos los usuarios</span> y <span className="text-white font-medium">todos los casos de uso</span> de Fromelabs, 
              sin excepción:
            </p>

            {/* Estándar 1 */}
            <div className="bg-gray-900 border-l-4 border-red-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">1. No Infringir Leyes ni Participar en Actividades Ilegales</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Adquirir, producir o intercambiar sustancias ilegales o controladas</li>
                <li>Facilitar la trata de personas, explotación sexual o prostitución</li>
                <li>Infringir derechos de propiedad intelectual de terceros</li>
                <li>Violar cualquier ley o normativa aplicable en tu jurisdicción</li>
              </ul>
            </div>

            {/* Estándar 2 */}
            <div className="bg-gray-900 border-l-4 border-red-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">2. No Poner en Riesgo Infraestructuras Críticas</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Destruir o interrumpir infraestructuras críticas (redes eléctricas, plantas de agua, dispositivos médicos, telecomunicaciones)</li>
                <li>Obtener acceso no autorizado a sistemas críticos (máquinas de votación, bases de datos sanitarias, mercados financieros)</li>
                <li>Interferir con bases militares o infraestructuras de defensa</li>
              </ul>
            </div>

            {/* Estándar 3 */}
            <div className="bg-gray-900 border-l-4 border-red-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">3. No Realizar Ciberataques ni Actividades Maliciosas</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Descubrir o explotar vulnerabilidades en sistemas sin autorización</li>
                <li>Obtener acceso no autorizado mediante ataques técnicos o ingeniería social</li>
                <li>Crear o distribuir malware, ransomware, virus o código malicioso</li>
                <li>Desarrollar herramientas de denegación de servicio (DDoS) o gestión de botnets</li>
                <li>Eludir controles de seguridad, sistemas de autenticación o herramientas de supervisión</li>
              </ul>
            </div>

            {/* Estándar 4 */}
            <div className="bg-gray-900 border-l-4 border-red-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">4. No Desarrollar ni Diseñar Armas</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Producir, modificar, diseñar o distribuir armas, explosivos o sistemas diseñados para causar daño</li>
                <li>Diseñar procesos de fabricación y entrega para despliegue de armas</li>
                <li>Sintetizar o desarrollar armas biológicas, químicas, radiológicas o nucleares, o sus precursores</li>
              </ul>
            </div>

            {/* Estándar 5 */}
            <div className="bg-gray-900 border-l-4 border-red-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">5. No Incitar a la Violencia ni al Odio</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Incitar, posibilitar o promover extremismo violento, terrorismo o discursos de odio</li>
                <li>Proporcionar apoyo material a organizaciones asociadas con extremismo violento</li>
                <li>Promover actos de violencia o intimidación contra personas, grupos, animales o propiedades</li>
                <li>Promover discriminación basada en raza, etnia, religión, sexo, orientación sexual u otros atributos protegidos</li>
              </ul>
            </div>

            {/* Estándar 6 */}
            <div className="bg-gray-900 border-l-4 border-red-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">6. No Poner en Riesgo la Privacidad ni Derechos de Identidad</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Violar derechos de privacidad según leyes de protección de datos (RGPD, LOPDGDD)</li>
                <li>Compartir información personal sin consentimiento o acceder a datos privados ilegalmente</li>
                <li>Recopilar información privada sin autorización (datos de contacto, sanitarios, biométricos, reconocimiento facial)</li>
                <li>Suplantar la identidad de una persona o hacer pasar contenido generado por IA como humano sin divulgación</li>
              </ul>
            </div>

            {/* Estándar 7 */}
            <div className="bg-gray-900 border-l-4 border-red-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">7. No Poner en Riesgo la Seguridad de Menores</h3>
              <p className="mb-2 text-red-400 font-medium">TOLERANCIA CERO. Queda estrictamente prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Crear, distribuir o promover material de abuso sexual infantil (CSAM), incluyendo CSAM generado con IA</li>
                <li>Facilitar la trata, sextorsión o cualquier forma de explotación de menores</li>
                <li>Facilitar la captación de menores (grooming) o generar contenido que suplante su identidad</li>
                <li>Facilitar o representar maltrato infantil</li>
                <li>Promover o posibilitar relaciones pedófilas</li>
                <li>Fetichizar o sexualizar a menores en cualquier contexto</li>
              </ul>
              <p className="text-sm text-gray-400 mt-2 italic">
                Nota: Definimos como menor a cualquier persona menor de 18 años. Denunciamos casos de CSAM a las autoridades competentes.
              </p>
            </div>

            {/* Estándar 8 */}
            <div className="bg-gray-900 border-l-4 border-orange-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">8. No Crear Contenido Psicológica o Emocionalmente Dañino</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Posibilitar, promover o glamorizar suicidio, autolesiones, trastornos alimentarios</li>
                <li>Criticar la forma o tamaño corporal de personas</li>
                <li>Avergonzar, humillar, intimidar, acosar o celebrar el sufrimiento de personas</li>
                <li>Generar contenido que represente crueldad o abuso animal</li>
                <li>Promover o representar violencia gráfica injustificada, incluida violencia sexual</li>
              </ul>
            </div>

            {/* Estándar 9 */}
            <div className="bg-gray-900 border-l-4 border-orange-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">9. No Crear ni Difundir Desinformación</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Crear información deliberadamente falsa sobre personas, grupos o entidades</li>
                <li>Crear información falsa sobre leyes, regulaciones o normas institucionales</li>
                <li>Crear y promover teorías conspiratorias para atacar grupos o individuos</li>
                <li>Suplantar entidades reales o crear personajes falsos</li>
                <li>Proporcionar información falsa relacionada con salud, medicina o ciencia</li>
              </ul>
            </div>

            {/* Estándar 10 */}
            <div className="bg-gray-900 border-l-4 border-orange-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">10. No Socavar Procesos Democráticos</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Participar en campañas electorales personalizadas sin consentimiento</li>
                <li>Crear movimientos políticos artificiales</li>
                <li>Generar comunicaciones automatizadas a funcionarios públicos ocultando su origen artificial</li>
                <li>Crear contenido político diseñado para engañar votantes</li>
                <li>Generar información falsa sobre procedimientos de votación o seguridad electoral</li>
                <li>Incitar perturbación de procesos electorales</li>
              </ul>
            </div>

            {/* Estándar 11 */}
            <div className="bg-gray-900 border-l-4 border-yellow-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">11. No Usar para Justicia Penal, Censura o Vigilancia Prohibida</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Tomar decisiones sobre aplicaciones de justicia penal, libertad condicional o sentencias</li>
                <li>Perseguir o rastrear ubicación, estado emocional o comunicaciones sin consentimiento</li>
                <li>Reconocimiento facial, vigilancia policial predictiva sin autorización</li>
                <li>Asignar puntuaciones a individuos sin notificación ni consentimiento</li>
                <li>Categorización biométrica para inferir raza, opiniones políticas, creencias religiosas, orientación sexual</li>
              </ul>
            </div>

            {/* Estándar 12 */}
            <div className="bg-gray-900 border-l-4 border-yellow-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">12. No Incurrir en Prácticas Fraudulentas o Predatorias</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Producir o distribuir bienes falsificados</li>
                <li>Generar o distribuir spam</li>
                <li>Generar contenido para estafas, phishing o malware</li>
                <li>Crear documentos falsificados (identidades, licencias, divisas)</li>
                <li>Generar reseñas o medios falsos</li>
                <li>Participar en marketing multinivel o sistemas piramidales</li>
                <li>Prácticas que exploten a personas vulnerables</li>
              </ul>
            </div>

            {/* Estándar 13 */}
            <div className="bg-gray-900 border-l-4 border-yellow-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">13. No Abusar de la Plataforma</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Coordinar actividades maliciosas a través de múltiples cuentas</li>
                <li>Crear múltiples cuentas para eludir barreras de protección</li>
                <li>Utilizar automatización en la creación de cuentas</li>
                <li>Eludir prohibiciones mediante cuentas diferentes</li>
                <li>Eludir salvaguardas del sistema (prompt injection, jailbreaking) sin autorización</li>
                <li>Utilizar datos para entrenar modelos de IA sin autorización (scraping)</li>
              </ul>
            </div>

            {/* Estándar 14 */}
            <div className="bg-gray-900 border-l-4 border-blue-600 p-5 mb-4">
              <h3 className="text-xl font-semibold text-white mb-3">14. No Generar Contenido Sexualmente Explícito</h3>
              <p className="mb-2">Queda prohibido utilizar Fromelabs para:</p>
              <ul className="space-y-1 ml-4 text-sm list-disc">
                <li>Representar o solicitar relaciones sexuales o actos sexuales</li>
                <li>Generar contenido relacionado con fetiches o fantasías sexuales</li>
                <li>Posibilitar, promover o representar incesto o zoofilia</li>
                <li>Participar en chats eróticos o de contenido sexual</li>
              </ul>
            </div>
          </section>

          {/* Casos Alto Riesgo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Requisitos para Casos de Uso de Alto Riesgo</h2>
            <div className="space-y-4">
              <p>
                Algunos casos de uso plantean un riesgo elevado de daños porque influyen en ámbitos vitales para el bienestar público y la equidad social. 
                Para estos casos, <span className="text-white font-medium">se requieren salvaguardas adicionales</span>:
              </p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li><span className="text-white font-medium">Aplicaciones de salud:</span> Diagnósticos, recomendaciones médicas → Requieren supervisión médica certificada</li>
                <li><span className="text-white font-medium">Servicios financieros:</span> Asesoramiento de inversión, gestión de riesgos → Requieren disclaimers y supervisión profesional</li>
                <li><span className="text-white font-medium">Sistemas de evaluación educativa:</span> Calificación automatizada → Requieren revisión humana y transparencia</li>
                <li><span className="text-white font-medium">Recursos humanos:</span> Selección de candidatos → Prohibimos decisiones automatizadas sin revisión humana</li>
              </ul>
              <p>
                Si planeas usar Fromelabs para alguno de estos casos, <span className="text-white font-medium">debes contactarnos previamente</span> en{' '}
                <a href="mailto:enterprise@fromelabs.com" className="text-blue-400 hover:text-blue-300 underline">
                  enterprise@fromelabs.com
                </a>.
              </p>
            </div>
          </section>

          {/* Consecuencias */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Consecuencias del Incumplimiento</h2>
            <div className="space-y-4">
              <p>El incumplimiento de esta Política puede resultar en:</p>
              <ul className="space-y-2 ml-6 border-l-2 border-gray-800 pl-6">
                <li><span className="text-white font-medium">Advertencia formal</span> (para infracciones leves y primera vez)</li>
                <li><span className="text-white font-medium">Suspensión temporal</span> de tu cuenta (de 7 a 30 días)</li>
                <li><span className="text-white font-medium">Suspensión permanente</span> sin posibilidad de reembolso</li>
                <li><span className="text-white font-medium">Bloqueo de resultados</span> cuando las entradas violen la política</li>
                <li><span className="text-white font-medium">Denuncia a autoridades</span> en casos de actividades ilegales (especialmente CSAM, terrorismo, fraude)</li>
              </ul>
              <p>
                Nos reservamos el derecho de suspender cuentas de forma inmediata sin previo aviso en casos de infracciones graves 
                que pongan en riesgo la seguridad de personas, especialmente menores.
              </p>
            </div>
          </section>

          {/* Reporte */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cómo Reportar Infracciones</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <p className="mb-4">
                Si detectas contenido o uso que viole esta Política, repórtalo inmediatamente:
              </p>
              <p className="text-white text-lg mb-3">
                <a href="mailto:usersafety@fromelabs.com" className="text-blue-400 hover:text-blue-300 underline">
                  usersafety@fromelabs.com
                </a>
              </p>
              <p className="text-sm">
                Incluye: descripción del contenido, capturas de pantalla (si es posible), fecha y hora, y cualquier información relevante.
              </p>
              <p className="text-sm mt-3">
                También puedes usar el botón "Reportar problema" disponible en la interfaz de Fromelabs.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Información de Contacto</h2>
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
                  <span className="text-white font-medium">Seguridad de usuarios:</span>
                  <a href="mailto:usersafety@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    usersafety@fromelabs.com
                  </a>
                </div>
                <div>
                  <span className="text-white font-medium">Consultas generales:</span>
                  <a href="mailto:soporte@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    soporte@fromelabs.com
                  </a>
                </div>
                <div>
                  <span className="text-white font-medium">Casos de uso empresariales:</span>
                  <a href="mailto:enterprise@fromelabs.com" className="ml-2 text-blue-400 hover:text-blue-300 underline">
                    enterprise@fromelabs.com
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
              <Link href="/legal/condiciones" className="text-gray-400 hover:text-blue-400 transition">
                Condiciones de Servicio
              </Link>
              <Link href="/legal/privacidad" className="text-gray-400 hover:text-blue-400 transition">
                Política de Privacidad
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
