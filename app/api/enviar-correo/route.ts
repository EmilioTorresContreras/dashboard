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
      from: 'onboarding@resend.dev',
      to: body.email,
      subject: "Bienvenido a Nuestra Plataforma",
      html: `
      <p>Hola ${body.nombre} ${body.apellido},</p>
    <p>Haz clic en el siguiente botón para establecer una nueva contraseña:</p>
    <a href="${link}" style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">
      Cambiar contraseña
    </a>
    `,
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: (error as Error).message });
  }
}
