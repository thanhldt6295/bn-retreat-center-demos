import type { CSSProperties } from 'react'
import utility from '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg?url'
import standard from '@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg?url'
import action from '@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg?url'
import doctype from '@salesforce-ux/design-system/assets/icons/doctype-sprite/svg/symbols.svg?url'

const SPRITES = { utility, standard, action, doctype }

type Props = {
  /** SLDS icon name, e.g. "close", "chevrondown", "date_input" */
  name: string
  /** SLDS sprite (default "utility") */
  sprite?: keyof typeof SPRITES
  /** SLDS icon size: xx-small 8px · x-small 12px · small 16px · medium 24px · large 32px */
  size?: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large'
  /** extra SLDS classes, e.g. "slds-input__icon slds-input__icon_right" */
  className?: string
  /** fill colour; defaults to the surrounding text colour (utility icons) */
  color?: string
  style?: CSSProperties
  title?: string
}

/** Official Lightning Design System icon (from the SLDS sprites). */
export function Icon({ name, sprite = 'utility', size = 'x-small', className = '', color, style, title }: Props) {
  const fill = sprite === 'utility' ? (color ?? 'currentColor') : undefined
  return (
    <svg
      className={`slds-icon slds-icon_${size} ${className}`}
      aria-hidden={title ? undefined : true}
      style={{ fill, ...style }}
    >
      {title && <title>{title}</title>}
      <use href={`${SPRITES[sprite]}#${name}`} />
    </svg>
  )
}

/** Square object icon (standard sprite) with its SLDS background colour. */
export function StandardIcon({ name, size = 'large' }: { name: string; size?: 'small' | 'medium' | 'large' }) {
  return (
    <span className={`slds-icon_container slds-icon-standard-${name.replace(/_/g, '-')}`}>
      <Icon name={name} sprite="standard" size={size} />
    </span>
  )
}
