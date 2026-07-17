import SegmentedToggle from '@/Components/Form/SegmentedToggle';
import { Droplets, Layers } from 'lucide-react';

const OPTIONS = [
    {
        value: 'fdm',
        label: 'Filamento',
        hint: 'FDM',
        description: 'Bobinas de filamento fundido — PLA, PETG, ABS...',
        icon: Layers,
    },
    {
        value: 'resin',
        label: 'Resina',
        hint: 'SLA / DLP / LCD',
        description: 'Cura de resina líquida por luz UV.',
        icon: Droplets,
    },
];

export default function TechnologyToggle({ value, onChange }) {
    return <SegmentedToggle options={OPTIONS} value={value} onChange={onChange} layoutId="technology-toggle-active" />;
}
