export type ContentGoal =
  | 'Promosi / Jualan'
  | 'Edukasi'
  | 'Storytelling / Hiburan'
  | 'Kampanye Brand';

export type PlatformAspect = '9:16' | '16:9' | '1:1';

export type VideoDuration = 15 | 30 | 60;

export type VisualStyle =
  | 'Sinematik Realistis'
  | 'Animasi 3D (Gaya Pixar)'
  | 'Ilustrasi Manhwa / Anime'
  | 'Minimalis Modern'
  | 'Dokumenter / Vlog';

export type ToneOption =
  | 'Santai & Relatable'
  | 'Profesional'
  | 'Lucu / Witty'
  | 'Emosional / Dramatis'
  | 'Persuasif';

export interface StoryFormInput {
  topic: string;
  goal: ContentGoal;
  platform: PlatformAspect;
  duration: VideoDuration;
  visualStyle: VisualStyle;
  tones: ToneOption[];
}

export interface StoryOverview {
  title: string;
  hook_opening: string;
  target_audience: string;
  music_mood_recommendation: string;
}

export interface StoryScene {
  scene_number: number;
  timecode: string;
  shot_type: string;
  visual_description_id: string;
  ai_visual_prompt_en: string;
  voiceover_dialogue: string;
  audio_sfx: string;
}

export interface AidaCaption {
  attention: string;
  interest: string;
  desire: string;
  action: string;
}

export interface SocialCopy {
  aida_caption: AidaCaption;
  seo_keywords: string[];
  hashtags: string[];
}

export interface StoryboardProject {
  id: string;
  input: StoryFormInput;
  overview: StoryOverview;
  scenes: StoryScene[];
  social_copy: SocialCopy;
  createdAt: string;
  isSample?: boolean;
}

export interface SavedStoryboardProject extends StoryboardProject {
  savedAt: string;
}

export type WorkspaceTab = 'storyboard' | 'voiceover' | 'caption';

export type ThemeMode = 'light' | 'dark';
