import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AwardAchievementRequest {
  achievement_id: string;
  user_id?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { achievement_id, user_id }: AwardAchievementRequest = await req.json();
    const targetUserId = user_id || user.id;

    console.log(`Awarding achievement ${achievement_id} to user ${targetUserId}`);

    // Check if user already has this achievement
    const { data: existingAchievement, error: checkError } = await supabase
      .from('achievements')
      .select('id')
      .eq('user_id', targetUserId)
      .eq('achievement_definition_id', achievement_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing achievement:', checkError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingAchievement) {
      return new Response(
        JSON.stringify({ message: 'Achievement already earned', achievement_id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get achievement definition
    const { data: definition, error: defError } = await supabase
      .from('achievement_definitions')
      .select('*')
      .eq('id', achievement_id)
      .single();

    if (defError || !definition) {
      console.error('Error fetching achievement definition:', defError);
      return new Response(
        JSON.stringify({ error: 'Achievement not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Award the achievement
    const { data: newAchievement, error: insertError } = await supabase
      .from('achievements')
      .insert({
        user_id: targetUserId,
        achievement_definition_id: achievement_id,
        achievement_type: definition.achievement_type,
        title: definition.title,
        description: definition.description,
        reward_coins: definition.reward_coins,
        achievement_data: {
          awarded_by: 'system',
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting achievement:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to award achievement' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Achievement awarded successfully:', newAchievement);

    return new Response(
      JSON.stringify({ 
        message: 'Achievement awarded successfully', 
        achievement: newAchievement 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in award-achievement function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});