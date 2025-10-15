export const darkTextFieldStyles = (isDark: boolean) => ({
    // ✅ Base input text
    "& .MuiInputBase-input": {
        color: isDark ? "#f8f9fa" : "#111",
        fontSize: "1rem",
        transition: "color 0.2s ease, border-color 0.2s ease",
    },

    // ✅ Label styles (normal, hover, focused, disabled)
    "& .MuiInputLabel-root": {
        color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)",
        fontSize: "1rem",
        transition: "color 0.2s ease",
    },
    "&:hover .MuiInputLabel-root": {
        color: isDark ? "rgba(255,255,255,0.9)" : "#1976d2",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: isDark ? "#fff" : "#1976d2",
    },
    "& .MuiInputLabel-root.Mui-disabled": {
        color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
    },

    // ✅ Dropdown / icon colors
    "& .MuiSvgIcon-root": {
        color: isDark ? "#e0e0e0" : "#333",
    },

    // ✅ Outlined border styles
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: isDark ? "#555" : "#ccc",
            transition: "border-color 0.2s ease",
        },
        "&:hover fieldset": {
            borderColor: isDark ? "#aaa" : "#666",
        },
        "&.Mui-focused fieldset": {
            borderColor: isDark ? "#fff" : "#1976d2",
            boxShadow: isDark
                ? "0 0 0 2px rgba(255,255,255,0.1)"
                : "0 0 0 2px rgba(25,118,210,0.1)",
        },
    },

    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: isDark
            ? "rgba(255,255,255,0.6)"
            : "rgba(0,0,0,0.6)",
    },
    "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
        borderColor: isDark ? "#444" : "#ddd",
    },

    "& .MuiFormHelperText-root": {
        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
    },
});
