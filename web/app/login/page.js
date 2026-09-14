import AuthForm from '@/components/auth/AuthForm';
export const metadata={title:'Sign in',robots:{index:false,follow:false}};
export default function Page(){return <section className="auth-page"><AuthForm mode="login" /></section>}
