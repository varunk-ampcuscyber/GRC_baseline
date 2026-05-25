declare module 'next' {
  export type Metadata = any;
  export type NextConfig = any;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}

declare module 'next/script' {
  const Script: any;
  export default Script;
}

declare module 'next/font/google' {
  export function Inter(options: any): any;
  export function Space_Grotesk(options: any): any;
  export function Orbitron(options: any): any;
}

declare module 'next/types.js' {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module 'next/server.js' {
  export type NextRequest = any;
  export const NextResponse: any;
}

declare module 'next/server' {
  export const NextResponse: any;
}
