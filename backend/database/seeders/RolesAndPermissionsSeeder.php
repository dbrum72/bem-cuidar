<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder {
    
    public function run() {
        // permissões básicas
        $permissions = [
            'invite-tutor',
            'manage-dependents',
            'manage-appointments',
            'manage-transactions',
            'view-notifications'
        ];
        foreach ($permissions as $p) {
            Permission::firstOrCreate(['name' => $p]);
        }

        // roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $tutor = Role::firstOrCreate(['name' => 'tutor']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // atribui permissões
        $admin->syncPermissions($permissions);
        $tutor->syncPermissions(['invite-tutor', 'manage-appointments', 'view-notifications']);
        $user->syncPermissions(['view-notifications']);
    }
}
