
function PageHeader({
    icon: Icon,
    title,
    subtitle,
}) {
    return (
        <div className="pt-10 pb-4">
            <div className="flex items-start gap-5">
                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                    "
                >
                    <Icon className="size-12 md:size-18" />
                </div>
                <div>
                    <h1
                        className="
                            text-3xl
                            font-semibold
                            uppercase
                            md:text-5xl
                    ">
                        {title}
                    </h1>
                    <span
                        className="
                            text-base
                            uppercase
                            tracking-[0.25em]
                            text-gray-500
                            md:tracking-[0.80em]
                    ">
                        {subtitle}
                    </span>
                </div>
            </div>
            <div className="mt-5 border-t border-black/10" />
        </div>
    );
}

export default PageHeader;