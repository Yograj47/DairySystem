export const darkTextFieldStyles = (isDark: boolean) => ({
    "& .MuiInputBase-input": { color: isDark ? "white" : "black" },
    "& .MuiInputLabel-root": { color: isDark ? "rgba(255,255,255,0.8)" : "gray" },
    "& .MuiInputLabel-root.Mui-disabled": { color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" },
    "& .MuiSvgIcon-root": { color: isDark ? "white" : "black" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: isDark ? "#555" : "#ccc" },
        "&:hover fieldset": { borderColor: isDark ? "white" : "#666" }, "&.Mui-focused fieldset": { borderColor: isDark ? "white" : "#1976d2" },
    }
    , "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" },
    "& .MuiOutlinedInput-root.Mui-disabled fieldset": { borderColor: isDark ? "#444" : "#ddd" },
});