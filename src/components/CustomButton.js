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
      case "text": // Added text variant
        return styles.outlineButton
      default:
        return styles.primaryButton
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
      case "text": // Added text variant
        return styles.outlineButtonText
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

  if (variant === "primary") {
    return (
      <TouchableOpacity
        style={[styles.button, getSizeStyle(), style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
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
        <ActivityIndicator color={variant === "outline" ? COLORS.primary : COLORS.white} size="small" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
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
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
})

export default CustomButton
