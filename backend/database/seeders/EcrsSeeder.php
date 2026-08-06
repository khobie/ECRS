<?php

namespace Database\Seeders;

use App\Models\CaseTimeline;
use App\Models\CrimeCategory;
use App\Models\CrimeType;
use App\Models\InvestigationNote;
use App\Models\PoliceStation;
use App\Models\Report;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EcrsSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            'Central Koforidua', 'Oyoko', 'Jumapo', 'Betom', 'Srodae',
            'Adweso', 'Effiduase', 'Old Estates', 'Pentecost Junction', 'Koforidua Technical Area',
        ];

        foreach ($zones as $i => $name) {
            Zone::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'sort_order' => $i + 1,
            ]);
        }

        $central = Zone::where('slug', 'central-koforidua')->first();
        $oyoko = Zone::where('slug', 'oyoko')->first();
        $jumapo = Zone::where('slug', 'jumapo')->first();
        $effiduase = Zone::where('slug', 'effiduase')->first();

        $hq = PoliceStation::create([
            'zone_id' => $central->id,
            'name' => 'Koforidua Divisional HQ',
            'code' => 'KFD-HQ',
            'address' => 'Jackson Park Road, Koforidua',
            'station_type' => 'headquarters',
            'latitude' => 6.0940,
            'longitude' => 0.2571,
        ]);

        $centralStation = PoliceStation::create([
            'zone_id' => $central->id,
            'name' => 'Koforidua Central Station',
            'code' => 'KFD-CENTRAL',
            'station_type' => 'station',
            'latitude' => 6.0935,
            'longitude' => 0.2568,
        ]);

        PoliceStation::create([
            'zone_id' => $oyoko->id,
            'name' => 'Oyoko Police Post',
            'code' => 'KFD-OYOKO',
            'station_type' => 'post',
        ]);

        PoliceStation::create([
            'zone_id' => $jumapo->id,
            'name' => 'Jumapo Police Post',
            'code' => 'KFD-JUMAPO',
            'station_type' => 'post',
        ]);

        PoliceStation::create([
            'zone_id' => $effiduase->id,
            'name' => 'Effiduase Police Post',
            'code' => 'KFD-EFFIDUASE',
            'station_type' => 'post',
        ]);

        $categories = [
            'Violent Crime' => ['Assault', 'Armed Robbery', 'Homicide', 'Domestic Violence', 'Kidnapping'],
            'Property Crime' => ['Burglary', 'Theft', 'Vandalism', 'Arson', 'Trespassing'],
            'Financial / Cyber' => ['Fraud', 'Online Scam', 'Mobile Money Fraud', 'Identity Theft', 'Extortion'],
            'Narcotics' => ['Drug Possession', 'Drug Trafficking', 'Illegal Substance Sale'],
            'Traffic / Public' => ['Reckless Driving', 'Hit and Run', 'Public Disturbance', 'Illegal Parking'],
            'Other' => ['Missing Person', 'Lost Property', 'Suspicious Activity', 'Other'],
        ];

        foreach ($categories as $catName => $types) {
            $category = CrimeCategory::create([
                'name' => $catName,
                'slug' => Str::slug($catName),
            ]);

            foreach ($types as $j => $typeName) {
                CrimeType::create([
                    'category_id' => $category->id,
                    'name' => $typeName,
                    'slug' => Str::slug($typeName),
                    'sort_order' => $j + 1,
                ]);
            }
        }

        User::create([
            'name' => 'Insp. Kwame Mensah',
            'email' => 'k.mensah@ecrs.gov',
            'password' => 'password',
            'role' => 'investigator',
            'station_id' => $centralStation->id,
            'rank' => 'Inspector',
            'badge_number' => 'KFD-001',
        ]);

        User::create([
            'name' => 'Nana Adusei',
            'email' => 'n.adusei@ecrs.gov',
            'password' => 'password',
            'role' => 'super_admin',
            'station_id' => $hq->id,
            'rank' => 'Administrator',
            'badge_number' => 'KFD-ADMIN',
        ]);

        $officer = User::where('email', 'k.mensah@ecrs.gov')->first();
        $violentCategory = CrimeCategory::where('name', 'Violent Crime')->first();
        $armedRobbery = CrimeType::where('name', 'Armed Robbery')->first();

        $demoReport = Report::create([
            'case_id' => 'KFD-2026-489201',
            'category_id' => $violentCategory->id,
            'crime_type_id' => $armedRobbery->id,
            'incident_date' => '2026-06-02',
            'incident_time' => '09:14:00',
            'location' => "Jackson's Park",
            'zone_id' => $central->id,
            'latitude' => 6.0940,
            'longitude' => 0.2571,
            'description' => 'Armed robbery reported near Jackson\'s Park, Koforidua. Suspect fled on foot.',
            'is_anonymous' => true,
            'status' => 'under_investigation',
            'priority' => 'high',
            'assigned_officer_id' => $officer->id,
            'station_id' => $centralStation->id,
            'submitted_at' => '2026-06-02 09:14:00',
        ]);

        CaseTimeline::create([
            'report_id' => $demoReport->id,
            'event_type' => 'submitted',
            'note' => 'Report received and logged into ECRS Koforidua.',
            'created_at' => '2026-06-02 09:14:00',
        ]);

        CaseTimeline::create([
            'report_id' => $demoReport->id,
            'actor_id' => $officer->id,
            'event_type' => 'assigned',
            'note' => 'Case assigned to Insp. Kwame Mensah, Koforidua Central.',
            'created_at' => '2026-06-02 15:40:00',
        ]);

        CaseTimeline::create([
            'report_id' => $demoReport->id,
            'actor_id' => $officer->id,
            'event_type' => 'status_changed',
            'old_value' => 'assigned',
            'new_value' => 'under_investigation',
            'note' => 'Investigation opened. Evidence under review.',
            'created_at' => '2026-06-04 10:05:00',
        ]);

        InvestigationNote::create([
            'report_id' => $demoReport->id,
            'author_id' => $officer->id,
            'note' => "Visited the scene at Jackson's Park, Koforidua. Collected CCTV footage from nearby shop. Two potential witnesses identified.",
            'created_at' => '2026-06-04 10:30:00',
        ]);

        InvestigationNote::create([
            'report_id' => $demoReport->id,
            'author_id' => $officer->id,
            'note' => 'Forensics confirmed fingerprints. Preparing case file for supervisory review.',
            'created_at' => '2026-06-08 09:00:00',
        ]);
    }
}
