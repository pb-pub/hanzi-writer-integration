import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';

export const settingsConfig: SettingSchemaDesc[] = [
    {
        key: 'hanzi',
        title: 'Hanzi settings',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'hanziQuizSize',
        title: 'Hanzi quiz size (width)',
        description: 'Select the size of the quiz area:',   
        type: 'number', 
        default: 150,
    },
    {
        key: 'hanziSVGSize',
        title: 'Hanzi image size (width and height)',
        description: 'Select the size of the SVG images (you will have to regenerate the already existing ones to make refresh their size):',   
        type: 'number', 
        default: 150,
    }
];