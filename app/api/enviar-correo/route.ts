import { Resend } from 'resend';
import { SignJWT } from "jose";

const resend = new Resend(process.env.RESEND_API_KEY);
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {

  const body = await req.json();

  try {
    const token = await new SignJWT(
      {
        clerkId: body.id,
        email: body.email
      }).setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);


    const link = `${baseUrl}/password?token=${token}`;

    await resend.emails.send({
  from: 'escuela.limon@emilio.korian-labs.net',
  to: body.email,
  subject: "🍋 ¡Bienvenido a Escuela Limón! Tu cuenta está lista",
  html: `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Escuela Limón</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      
      <!-- Contenedor principal -->
      <div style="max-width: 680px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header con logo y branding -->
        <div style="background: white; border-radius: 16px 16px 0 0; padding: 40px 40px 20px; text-align: center; position: relative; overflow: hidden;">
          <!-- Decoración de fondo -->
          <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%); border-radius: 50%; opacity: 0.1;"></div>
          <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); border-radius: 50%; opacity: 0.1;"></div>
          
          <!-- Logo/Icono -->
          <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; margin-bottom: 20px; position: relative;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 36px; font-weight: bold;">🎓</div>
          </div>
          
          <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            Escuela Limón
          </h1>
          <p style="margin: 8px 0 0; color: #6b7280; font-size: 16px; font-weight: 500;">
            Plataforma Educativa Digital
          </p>
        </div>

        <!-- Contenido principal -->
        <div style="background: white; padding: 40px; position: relative;">
          
          <!-- Saludo personalizado -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 8px 20px; background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%); border-radius: 25px; margin-bottom: 16px;">
              <span style="color: white; font-weight: 600; font-size: 14px;">¡CUENTA ACTIVADA!</span>
            </div>
            <h2 style="margin: 0; font-size: 28px; font-weight: 700; color: #111827; line-height: 1.3;">
              ¡Hola, ${body.nombre} ${body.apellido}! 👋
            </h2>
            <p style="margin: 12px 0 0; color: #6b7280; font-size: 18px; line-height: 1.5;">
              Tu cuenta ha sido creada exitosamente. Estamos emocionados de tenerte con nosotros.
            </p>
          </div>

          <!-- Credenciales de acceso -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 32px 0; position: relative;">
            <div style="position: absolute; top: -12px; left: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">
              CREDENCIALES DE ACCESO
            </div>
            
            <div style="margin-top: 8px;">
              <p style="margin: 0 0 16px; color: #374151; font-size: 16px; font-weight: 600;">
                🔐 Tu contraseña temporal:
              </p>
              <div style="background: #1f2937; border: 2px dashed #4b5563; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
                <code style="color: #fbbf24; font-size: 18px; font-weight: 700; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                  ${body.password}
                </code>
              </div>
              <p style="margin: 16px 0 0; color: #ef4444; font-size: 14px; font-weight: 600; text-align: center;">
                ⚠️ Por tu seguridad, cambia esta contraseña inmediatamente
              </p>
            </div>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${link}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
              🚀 Cambiar Contraseña Ahora
            </a>
            <p style="margin: 16px 0 0; color: #6b7280; font-size: 14px;">
              O copia y pega este enlace: <span style="color: #667eea; word-break: break-all;">${link}</span>
            </p>
          </div>

          <!-- Características/Beneficios -->
          <div style="margin: 40px 0; padding: 24px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border-left: 4px solid #0ea5e9;">
            <h3 style="margin: 0 0 16px; color: #0c4a6e; font-size: 18px; font-weight: 700;">
              🌟 ¿Qué puedes hacer ahora?
            </h3>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; color: #374151;">
                <span style="margin-right: 12px; font-size: 16px;">📚</span>
                <span style="font-size: 15px;">Accede a todos nuestros cursos premium</span>
              </div>
              <div style="display: flex; align-items: center; color: #374151;">
                <span style="margin-right: 12px; font-size: 16px;">🎯</span>
                <span style="font-size: 15px;">Personaliza tu experiencia de aprendizaje</span>
              </div>
              <div style="display: flex; align-items: center; color: #374151;">
                <span style="margin-right: 12px; font-size: 16px;">👥</span>
                <span style="font-size: 15px;">Conecta con nuestra comunidad educativa</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1f2937; border-radius: 0 0 16px 16px; padding: 32px 40px; text-align: center; color: white;">
          <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 8px; font-size: 16px; font-weight: 600;">
              ¿Necesitas ayuda?
            </h4>
            <p style="margin: 0; color: #9ca3af; font-size: 14px;">
              Nuestro equipo de soporte está aquí para ayudarte 24/7
            </p>
          </div>
          
          <!-- Links de soporte -->
          <div style="margin: 24px 0; padding: 16px 0; border-top: 1px solid #374151; border-bottom: 1px solid #374151;">
            <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 16px; font-size: 14px; font-weight: 500;">📧 Soporte</a>
            <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 16px; font-size: 14px; font-weight: 500;">❓ FAQ</a>
            <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 16px; font-size: 14px; font-weight: 500;">📱 Contacto</a>
          </div>

          <!-- Copyright -->
          <p style="margin: 16px 0 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
            © ${new Date().getFullYear()} <strong>Escuela Limón</strong>. Todos los derechos reservados.<br>
            Si no creaste esta cuenta, puedes ignorar este correo de forma segura.
          </p>
        </div>

        <!-- Nota de seguridad -->
        <div style="text-align: center; margin-top: 24px; padding: 16px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; backdrop-filter: blur(10px);">
          <p style="margin: 0; color: white; font-size: 12px; opacity: 0.8;">
            🔒 Este correo contiene información confidencial. Mantenlo seguro.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
});

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: (error as Error).message });
  }
}
