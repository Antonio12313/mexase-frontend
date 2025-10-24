import {SetBreadcrumbs} from "@/lib/breadcrumbs-context";

export default function HomePage() {

    return (
        <>
            <SetBreadcrumbs items={[
                { label: 'Home', href: '/home' },
                { label: 'Início' }
            ]} />
            <div>
                <h1>Bem-vindo à Home</h1>
                <p>Conteúdo que eu quero</p>
            </div>
        </>
    )
}