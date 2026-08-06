<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('station_id')->nullable()->after('id')->constrained('police_stations')->nullOnDelete();
            $table->string('phone', 30)->nullable()->after('email');
            $table->enum('role', ['super_admin', 'police_commander', 'investigator', 'station_officer'])->default('investigator')->after('password');
            $table->enum('status', ['active', 'disabled'])->default('active')->after('role');
            $table->string('badge_number', 50)->nullable()->after('status');
            $table->string('rank', 80)->nullable()->after('badge_number');
            $table->boolean('two_factor_enabled')->default(false)->after('rank');
            $table->timestamp('last_active_at')->nullable()->after('two_factor_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['station_id']);
            $table->dropColumn([
                'station_id', 'phone', 'role', 'status',
                'badge_number', 'rank', 'two_factor_enabled', 'last_active_at',
            ]);
        });
    }
};
