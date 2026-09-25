function Button({
    children,
    variant="primary",
    className=""
}) {

const styles = {

    primary:
    `
    bg-slate-900
    text-white
    hover:bg-slate-700
    `,
    secondary:
    `
    bg-white
    border
    border-slate-300
    text-slate-900
    `

}

return (
<button
className={`
    px-6
    py-3
    rounded-xl
    font-medium
    transition
    duration-300
    ${styles[variant]}
    ${className}
`}

>

{children}

</button>


)


}


export default Button;