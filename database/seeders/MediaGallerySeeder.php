<?php

namespace Database\Seeders;

use App\Models\MediaGallery;
use Illuminate\Database\Seeder;

class MediaGallerySeeder extends Seeder
{
    public function run()
    {
        $mediaItems = [
            // School 1 Media
            [
                'school_id' => 1,
                'type' => 'image',
                'url' => 'schools/1/images/event1.jpg',
                'description' => 'حفل تخريج الدفعة 2023',
            ],
            [
                'school_id' => 1,
                'type' => 'video',
                'url' => 'schools/1/videos/activity1.mp4',
                'description' => 'اليوم الرياضي المدرسي',
            ],
            
            // School 2 Media
            [
                'school_id' => 2,
                'type' => 'image',
                'url' => 'schools/2/images/science_fair.jpg',
                'description' => 'معرض العلوم السنوي',
            ],
            [
                'school_id' => 2,
                'type' => 'image',
                'url' => 'schools/2/images/library.jpg',
                'description' => 'المكتبة المدرسية',
            ],
            
            // School 3 Media
            [
                'school_id' => 3,
                'type' => 'video',
                'url' => 'schools/3/videos/play.mp4',
                'description' => 'مسرحية مدرسية بعنوان "وطني"',
            ]
        ];

        foreach ($mediaItems as $media) {
            MediaGallery::create([
                'school_id' => $media['school_id'],
                'type' => $media['type'],
                'url' => $media['url'],
                'description' => $media['description'],
                'uploaded_at' => now()->subDays(rand(1, 90))->format('Y-m-d H:i:s'),
            ]);
        }
    }
}
