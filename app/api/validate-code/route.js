import { validateCode } from '@/lib/cache';

export async function POST(request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return Response.json({ valid: false, error: 'Code required' }, { status: 400 });
    }
    
    const isValid = validateCode(code);
    
    return Response.json({ valid: isValid });
  } catch (error) {
    return Response.json({ valid: false, error: 'Validation failed' }, { status: 500 });
  }
}