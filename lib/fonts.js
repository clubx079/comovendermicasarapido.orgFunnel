// Headlines and text. next/font needs literal options in every call.
import { Source_Serif_4, Source_Sans_3 } from 'next/font/google';

const serif = Source_Serif_4({ subsets: ['latin'], display: 'swap', variable: '--f-serif' });
const sans = Source_Sans_3({ subsets: ['latin'], display: 'swap', variable: '--f-sans' });

/** The two variable class names for <html>. */
export const fontClasses = `${serif.variable} ${sans.variable}`;
