<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('case_id', 30)->unique();
            $table->string('tracking_pin', 10)->nullable();

            $table->foreignId('category_id')->constrained('crime_categories')->restrictOnDelete();
            $table->foreignId('crime_type_id')->constrained('crime_types')->restrictOnDelete();

            $table->date('incident_date');
            $table->time('incident_time')->nullable();
            $table->string('location');
            $table->foreignId('zone_id')->constrained()->restrictOnDelete();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            $table->text('description');
            $table->text('suspect_info')->nullable();
            $table->text('witness_info')->nullable();

            $table->boolean('is_anonymous')->default(false);
            $table->string('reporter_name')->nullable();
            $table->string('reporter_phone', 30)->nullable();
            $table->string('reporter_email')->nullable();

            $table->enum('status', [
                'submitted', 'assigned', 'under_investigation',
                'pending_review', 'resolved', 'closed',
            ])->default('submitted');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->foreignId('assigned_officer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('station_id')->nullable()->constrained('police_stations')->nullOnDelete();

            $table->text('resolution_summary')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('priority');
            $table->index('zone_id');
            $table->index('submitted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
