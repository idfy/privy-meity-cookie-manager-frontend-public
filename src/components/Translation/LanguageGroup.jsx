/**
 * Open Bharat Digital Consent by IDfy
 * Copyright (c) 2025 Baldor Technologies Private Limited (IDfy)
 *
 * This software is licensed under the Privy Public License.
 * See LICENSE.md for the full terms of use.
 *
 * Unauthorized copying, modification, distribution, or commercial use
 * is strictly prohibited without prior written permission from IDfy.
 */

import { DropdownIcon } from 'components/Common/SvgComponents'
import { getStatusIcon } from 'utils/translationUtils'
import { useTranslation } from 'contexts/TranslationContext'

const LanguageGroup = ({
  group,
  selectedLanguageGroups,
  expandedGroups,
  onGroupSelection,
  onToggleDropdown,
  isTranslating
}) => {
  const { getTranslationStatus } = useTranslation()

  return (
    <div key={group.id} className='language-group-container'>
      <div className='combined-languages'>
        <div onClick={() => onToggleDropdown(group.id)} className='lang-title'>
          <input
            type='checkbox'
            checked={selectedLanguageGroups.includes(group.id) || false}
            onChange={() => onGroupSelection(group.id)}
            onClick={(e) => e.stopPropagation()}
            disabled={isTranslating}
          />
          <span className='text-sm'>
            {group.name} ({group.description})
          </span>
        </div>
        <DropdownIcon
          height={25}
          width={25}
          fillColor='#000'
          className={`cursor-pointer ${expandedGroups[group.id] ? 'rotate-icon' : ''}`}
          onClick={() => onToggleDropdown(group.id)}
        />
      </div>

      {/* Expanded Language List */}
      <div className={`language-list-expanded ${expandedGroups[group.id] ? 'expanded' : ''}`}>
        {Object.keys(group.languages).map(lang => (
          <div key={lang} className='language-item '>
            {getStatusIcon(getTranslationStatus(lang))}
            <span className='language-name'>{group.languages[lang]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LanguageGroup
