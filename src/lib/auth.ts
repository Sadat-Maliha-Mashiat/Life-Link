import { supabase } from './supabase';

export async function signUp(
  email: string,
  password: string,
  userData: {
    name: string;
    phone: string;
    blood_group: string;
    location: string;
  }
) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Give auth session a moment to be established
    await new Promise(resolve => setTimeout(resolve, 100));

    const { error: userError } = await supabase.from('users').insert({
      id: authData.user.id,
      name: userData.name,
      email: email,
      phone: userData.phone,
      blood_group: userData.blood_group,
      location: userData.location,
    });

    if (userError) {
      console.error('User insert error:', userError);
      throw new Error(`Failed to create user profile: ${userError.message}`);
    }

    const { error: donorError } = await supabase.from('donors').insert({
      user_id: authData.user.id,
      availability: true,
    });

    if (donorError) {
      console.error('Donor insert error:', donorError);
      throw new Error(`Failed to create donor profile: ${donorError.message}`);
    }

    return authData;
  } catch (error: any) {
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteUserAccount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');

  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', user.id);

  if (deleteError) throw deleteError;

  const { error: authError } = await supabase.auth.signOut();
  if (authError) throw authError;
}

export async function createUserProfile(userData: {
  name: string;
  phone: string;
  blood_group: string;
  location: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');

  const { error: userError } = await supabase.from('users').insert({
    id: user.id,
    name: userData.name,
    email: user.email || '',
    phone: userData.phone,
    blood_group: userData.blood_group,
    location: userData.location,
  });

  if (userError) throw userError;

  const { error: donorError } = await supabase.from('donors').insert({
    user_id: user.id,
    availability: true,
  });

  if (donorError) throw donorError;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}`,
  });

  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}
