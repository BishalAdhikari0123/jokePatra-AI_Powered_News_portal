import 'dotenv/config';
import { supabaseAdmin } from '../lib/supabase';
import { hashPassword } from '../lib/auth';

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@jokepatra.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';

  try {
    // Check if Supabase Admin is initialized
    if (!supabaseAdmin) {
      console.error('Error: Supabase Admin is not initialized.');
      console.error('Please check your environment variables:');
      console.error('  - NEXT_PUBLIC_SUPABASE_URL');
      console.error('  - SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }

    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          email,
          password: hashedPassword,
          role: 'admin',
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nPlease change the password after first login.');
  } catch (err) {
    console.error('Failed to create admin user:', err);
    process.exit(1);
  }
}

createAdminUser();
