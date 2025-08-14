// SIMPLE FALLBACK VERSION - NO BULLSHIT
export async function logSymptomSimple(supabase, user, symptomData) {
  console.log('🚀 SIMPLE SYMPTOM LOGGING');
  console.log('User ID:', user?.id);
  console.log('Symptom:', symptomData);
  
  if (!user) {
    alert('Please log in first');
    return { error: 'No user' };
  }
  
  try {
    // Just insert the damn thing
    const { data, error } = await supabase
      .from('symptoms')
      .insert({
        user_id: user.id,
        type: symptomData.type || 'test',
        severity: symptomData.severity || 2,
        notes: symptomData.notes || '',
        date: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ ERROR:', error);
      alert(`Error: ${error.message}`);
      return { error };
    }
    
    console.log('✅ SUCCESS:', data);
    alert('Symptom saved!');
    return { data };
    
  } catch (err) {
    console.error('❌ CATCH ERROR:', err);
    alert(`Failed: ${err.message}`);
    return { error: err };
  }
}