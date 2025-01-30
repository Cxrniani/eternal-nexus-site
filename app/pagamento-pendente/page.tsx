export default function Pending() {
    return (
        <>
            <div className="w-full bg-slate-900">
                <div className="max-container py-10 flex flex-col">
                    <h1 className="text-5xl px-3 md:px-0 pb-5 font-extrabold">Pagamento Pendente.</h1>
                    <h3 className="text-2xl font-medium py-5 px-3 md:pl-0 md:pr-96">
                        Seu pagamento está <span className="font-extrabold">em análise</span>... <br/>Você receberá um e-mail assim que o pagamento for aprovado! 
                        Após a confirmação o ingresso estará  disponível na aba "Ingressos" da sua conta. <br/>Esse processo pode levar alguns minutos.</h3>
                    <h4 className="text-xl font-medium py-5 px-3 md:pl-0 md:pr-96">Em caso de problemas ou dúvidas, contate: synopsyservice@gmail.com</h4>
                </div>
            </div>
        </>
    )
}