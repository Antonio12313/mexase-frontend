import {LoginForm} from "@/components/login-form";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10" style={{backgroundColor: '#ECF4F3'}}>
            <div className="w-full h-[600px]">
                <LoginForm/>
            </div>
        </div>
    );
}
