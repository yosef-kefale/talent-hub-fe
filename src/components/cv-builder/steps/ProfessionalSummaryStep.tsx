import { Profile } from '@/app/cv-builder/page';

interface ProfessionalSummaryStepProps {
  profile: Profile;
  onUpdate: (data: Partial<Profile>) => void;
}

export default function ProfessionalSummaryStep({
  profile,
  onUpdate,
}: ProfessionalSummaryStepProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900'>
          Professional Summary
        </h2>
        <p className='mt-1 text-sm text-gray-500'>
          Write a compelling summary that highlights your key qualifications and
          career goals.
        </p>
      </div>

      <div>
        <label
          htmlFor='slogan'
          className='block text-sm font-medium text-gray-700'
        >
          Professional Summary
        </label>
        <div className='mt-1'>
          <textarea
            id='slogan'
            rows={6}
            value={profile.slogan}
            onChange={(e) => onUpdate({ slogan: e.target.value })}
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            placeholder='Experienced software engineer with a passion for building scalable applications...'
          />
        </div>
        <p className='mt-2 text-sm text-gray-500'>
          Write 3-5 sentences that summarize your professional background and
          career objectives.
        </p>
      </div>

      <div className='bg-blue-50 p-4 rounded-md'>
        <h3 className='text-sm font-medium text-blue-800'>
          Tips for a great summary:
        </h3>
        <ul className='mt-2 text-sm text-blue-700 list-disc list-inside space-y-1'>
          <li>Start with your years of experience and main expertise</li>
          <li>Highlight your key achievements and skills</li>
          <li>Mention your career goals and what you're looking for</li>
          <li>Keep it concise and focused on your target role</li>
          <li>Use action verbs and specific examples</li>
        </ul>
      </div>
    </div>
  );
}
