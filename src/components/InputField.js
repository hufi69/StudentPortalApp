"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  style,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = "sentences",
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons 
              name={leftIcon} 
              size={20} 
              color={isFocused ? COLORS.primary : COLORS.gray} 
            />
          </View>
        )}

        <View style={styles.inputWrapper}>
          {label && (
            <Text style={[
              styles.floatingLabel,
              (isFocused || value) && styles.floatingLabelActive,
              isFocused && styles.floatingLabelFocused
            ]}>
              {label}
            </Text>
          )}
          <TextInput
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
              multiline && styles.multilineInput,
              label && styles.inputWithFloatingLabel,
            ]}
            placeholder={isFocused ? "" : placeholder}
            placeholderTextColor={COLORS.textSecondary}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? "top" : "center"}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        {secureTextEntry && (
          <TouchableOpacity style={styles.rightIconContainer} onPress={togglePasswordVisibility}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color={isFocused ? COLORS.primary : COLORS.gray} 
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity style={styles.rightIconContainer} onPress={onRightIconPress}>
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={isFocused ? COLORS.primary : COLORS.gray} 
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.grayLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    shadowColor: COLORS.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.1,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.grayLight,
    opacity: 0.6,
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
  },
  floatingLabel: {
    position: "absolute",
    left: 0,
    top: 18,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textSecondary,
    zIndex: 1,
  },
  floatingLabelActive: {
    transform: [{ translateY: -8 }, { scale: 0.85 }],
  },
  floatingLabelFocused: {
    color: COLORS.primary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 16,
    fontWeight: "500",
  },
  inputWithFloatingLabel: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  inputWithLeftIcon: {
    marginLeft: 12,
  },
  inputWithRightIcon: {
    marginRight: 12,
  },
  multilineInput: {
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 100,
  },
  leftIconContainer: {
    marginRight: 8,
    padding: 4,
  },
  rightIconContainer: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginLeft: 6,
    fontWeight: "500",
  },
})

export default InputField