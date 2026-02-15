<div
    ref={setNodeRef}
    style={style}
    className="border p-6 mb-6 bg-black"
>
    {/* DRAG HANDLE */}
    <div
        {...attributes}
        {...listeners}
        className="cursor-move text-xs opacity-60 mb-4 select-none"
    >
        ⠿ Drag section
    </div>

    {children}
</div>