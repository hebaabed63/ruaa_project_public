<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    public function run()
    {
        // Create sample conversations
        $conversations = [
            [
                'school_id' => 1,
                'conversation_type' => 'supervisor_manager',
                'status' => 'open',
                'messages' => [
                    [
                        'sender_type' => 'supervisor',
                        'sender_id' => 4, // Supervisor ID
                        'content' => 'مرحباً، أود مناقشة نتائج الزيارة الميدانية الأخيرة',
                        'attachment_type' => null,
                        'attachment_url' => null,
                    ],
                    [
                        'sender_type' => 'school_manager',
                        'sender_id' => 2, // School manager ID
                        'content' => 'أهلاً بك، نعم تفضل ما هي الملاحظات؟',
                        'attachment_type' => null,
                        'attachment_url' => null,
                    ]
                ]
            ],
            [
                'school_id' => 2,
                'conversation_type' => 'parent_manager',
                'status' => 'open',
                'messages' => [
                    [
                        'sender_type' => 'parent',
                        'sender_id' => 6, // Parent ID
                        'content' => 'السلام عليكم، أود الاستفسار عن نظام الامتحانات الجديد',
                        'attachment_type' => null,
                        'attachment_url' => null,
                    ]
                ]
            ]
        ];

        foreach ($conversations as $conversationData) {
            $conversation = Conversation::create([
                'school_id' => $conversationData['school_id'],
                'conversation_type' => $conversationData['conversation_type'],
                'status' => $conversationData['status'],
            ]);

            foreach ($conversationData['messages'] as $message) {
                Message::create([
                    'conversation_id' => $conversation->conversation_id,
                    'sender_type' => $message['sender_type'],
                    'sender_id' => $message['sender_id'],
                    'content' => $message['content'],
                    'attachment_type' => $message['attachment_type'],
                    'attachment_url' => $message['attachment_url'],
                    'timestamp' => now()->subDays(rand(1, 10)),
                ]);
            }
        }
    }
}
