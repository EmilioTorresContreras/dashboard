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
    const year = new Date().getFullYear()
    const password = `${body.nombre.slice(0, 3)}${body.apellido.slice(0, 3)}Limon${year}`

    await resend.emails.send({
      from: 'escuela.limon@emilio.korian-labs.net',
      to: body.email,
      subject: "Bienvenido a Nuestra Plataforma",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
      <h2 style="color: #111827;">¡Bienvenido, ${body.nombre} ${body.apellido}!</h2>

      <p style="color: #374151; font-size: 16px;">
        Gracias por unirte a nuestra plataforma. Tu cuenta ha sido creada exitosamente.
      </p>

      <p style="color: #374151; font-size: 16px;">
        <strong>Tu contraseña temporal es:</strong> <code style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${password}</code>
      </p>

      <p style="color: #374151; font-size: 16px;">
        Para tu seguridad, te pedimos que cambies esta contraseña lo antes posible.
      </p>

      <div style="margin: 24px 0;">
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Cambiar contraseña
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        Si tú no creaste esta cuenta, por favor ignora este correo.
      </p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        © ${new Date().getFullYear()} Escuela Limon. Todos los derechos reservados.
      </p>
    </div>
  `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: (error as Error).message });
  }
}
