function UnidadCaracteristica({ icon, label, value }) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                py-1
        ">
            <div className="flex items-center gap-2">
                <span className="text-slate-700">
                    {icon}
                </span>
                <span className="text-sm text-slate-500">
                    {label}
                </span>
            </div>
            <span className="text-sm text-slate-500">
                {value ?? 0}
            </span>
        </div>
    );
}

export default UnidadCaracteristica;