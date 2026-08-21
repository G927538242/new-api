/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import type { FC } from 'react'

interface ProviderIconProps {
  className?: string
  size?: number
}

// All icons are sourced directly from TokenHub's live homepage
// (https://tokenhub.com/zh) and downloaded locally to ensure
// reliable loading without CDN dependency issues.

const DEFAULT_SIZE = 18

// --- Inline SVG icons (extracted from tokenhub.com page source) ---

const OpenAISvgPath =
  'M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z'

const GrokSvgPath =
  'M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z'

const RunwaySvgPath =
  'M17.86 22.992c-2.669.245-4.887-2.876-6.597-4.454C10.398 24.759 1 24.177 1 17.86V6.15c0-.921.244-1.861.733-2.65C2.635 1.977 4.383.98 6.15 1h11.71c6.316 0 6.918 9.398.677 10.243l2.97 2.951c3.252 3.064.808 8.929-3.646 8.797zm-1.428-3.721c1.842 1.898 4.774-1.034 2.876-2.876l-5.132-5.132H11.3v2.876l4.436 4.436.696.696zM4.12 17.842c-.037 2.632 4.117 2.632 4.06 0V6.132c.038-1.316-1.353-2.35-2.612-1.955-.057.019-.113.037-.15.056-.79.301-1.335 1.09-1.317 1.936v11.673h.02zm13.74-9.68c2.632.037 2.632-4.098 0-4.06h-6.973c.526 1.109.395 2.857.413 4.06h6.56z'

const SvgIcon: FC<{ path: string; size: number; className?: string }> = ({
  path,
  size,
  className,
}) => (
  <svg
    fill='currentColor'
    fillRule='evenodd'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    className={className}
    style={{ flex: 'none', lineHeight: 1 }}
    aria-hidden='true'
  >
    <path d={path} />
  </svg>
)

// --- CDN image icons ---

const ImgIcon: FC<{ src: string; alt: string; size: number; className?: string }> = ({
  src,
  alt,
  size,
  className,
}) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    loading='lazy'
    decoding='async'
    className={className}
    style={{ objectFit: 'contain', display: 'block' }}
  />
)

// --- Provider icon components ---

export const OpenAIIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <SvgIcon path={OpenAISvgPath} size={size ?? DEFAULT_SIZE} className={className} />
)

export const GeminiIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/gemini.png'
    alt='Gemini'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const AnthropicIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/claude.png'
    alt='Claude'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const DeepSeekIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/deepseek.svg'
    alt='DeepSeek'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const ByteDanceIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/bytedance.png'
    alt='Bytedance'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const ElevenLabsIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/elevenlabs.jpeg'
    alt='ElevenLabs'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const MinimaxIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/minimax.jpeg'
    alt='Minimax'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

// Alibaba / Tongyi
export const AlibabaIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/alibaba.svg'
    alt='Alibaba'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

// Moonshot AI (Kimi)
export const MoonshotIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/moonshot.png'
    alt='Moonshot'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const KlingIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/kling.png'
    alt='Kling'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const ViduIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/vidu-icon.svg'
    alt='Vidu'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const GrokIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <SvgIcon path={GrokSvgPath} size={size ?? DEFAULT_SIZE} className={className} />
)

export const WanIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/wan-icon.png'
    alt='Wan'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const RunwayIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <SvgIcon path={RunwaySvgPath} size={size ?? DEFAULT_SIZE} className={className} />
)

// Zhipu AI (GLM)
export const ZhipuIcon: FC<ProviderIconProps> = ({ className, size }) => (
  <ImgIcon
    src='/assets/tokenhub/icons/zhipu.svg'
    alt='Zhipu'
    size={size ?? DEFAULT_SIZE}
    className={className}
  />
)

export const providerIconMap: Record<string, FC<ProviderIconProps>> = {
  'home.marquee.openai': OpenAIIcon,
  'home.marquee.gemini': GeminiIcon,
  'home.marquee.claude': AnthropicIcon,
  'home.marquee.deepseek': DeepSeekIcon,
  'home.marquee.bytedance': ByteDanceIcon,
  'home.marquee.elevenlabs': ElevenLabsIcon,
  'home.marquee.minimax': MinimaxIcon,
  'home.marquee.kling': KlingIcon,
  'home.marquee.vidu': ViduIcon,
  'home.marquee.grok': GrokIcon,
  'home.marquee.wan': WanIcon,
  'home.marquee.runway': RunwayIcon,
}
