import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { COLORS } from "../constants/colors"


const CustomButton = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton
      case "outline":
        return styles.outlineButton
      case "ghost":
        return styles.ghostButton
      case "glass":
        return styles.glassButton
      default:
        return styles.primaryButton
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
      case "ghost":
        return styles.outlineButtonText
      case "glass":
        return styles.glassButtonText
      default:
        return styles.buttonText
    }
  }

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return styles.smallButton
      case "large":
        return styles.largeButton
      default:
        return styles.mediumButton
    }
  }

  const getGradientColors = () => {
    switch (variant) {
      case "secondary":
        return COLORS.secondaryGradient
      case "accent":
        return COLORS.accentGradient
      case "success":
        return COLORS.successGradient
      case "error":
        return COLORS.errorGradient
      case "warning":
        return COLORS.warningGradient
      default:
        return COLORS.primaryGradient
    }
  }

  if (variant === "primary" || variant === "secondary" || variant === "accent" || variant === "success" || variant === "error" || variant === "warning") {
    return (
      <TouchableOpacity
        style={[styles.button, getSizeStyle(), style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={[styles.gradient, getSizeStyle()]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), getSizeStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? COLORS.primary : COLORS.white} size="small" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.05,
  },
  ghostButton: {
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.05,
  },
  glassButton: {
    backgroundColor: COLORS.glassBg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.1,
  },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 40,
  },
  mediumButton: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    minHeight: 52,
  },
  largeButton: {
    paddingVertical: 20,
    paddingHorizontal: 36,
    minHeight: 60,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  glassButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
})

export default CustomButton